import React, {useEffect, useMemo, useRef, useState} from "react";
import {Text, Circle, Layer, Line, Rect, Stage} from "react-konva";
import '../field/field.css';
import {EDIT_MODE, SIMULATION_MODE, SIMULATION_PAUSE_MODE} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {SimulatedField} from "../../../Types/SimulatedField";
import {Field} from "../../../Types/Field";
import {Coord} from "../../../Types/Coord";
import {changeCell, updateFieldOnServer} from "../../../redux/fieldSlice";
import {log} from "util";

let isMouseButton2Down = false;
const FIELD_OUTSIDE_VIEW = 0.15;
const CELL_PADDING = 1;
const MIN_CELL_SIZE = 2;
const MAX_CELL_SIZE = 90;
const ZOOM_STEP = 0.2;
const INITIAL_CELL_SIZE = 70;

type FieldPositionStyle =
{
    left: number,
    top: number,
};

export const CanvasField: React.FC = () =>
{
    const fieldElement = useRef<HTMLDivElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);

    const [canvasPositionStyle, setCanvasPositionStyle] = useState<FieldPositionStyle>({left: 0 , top:0});

    const [rerender, setRerender] = useState(0)

    const [startCellX, setStartCellX] = useState<number>(0);
    const [startCellY, setStartCellY] = useState<number>(0);

    const [cellSize, setCellSize] = useState<number>(INITIAL_CELL_SIZE);

    const dispatch = useAppDispatch();

    const currentMode = useAppSelector( state => state.playGround.mode);

    const simulatedField = useAppSelector( state => state.playGround.simulatedField);
    const activeField = useAppSelector( state => state.field.field);
    let field: SimulatedField | Field;
    if (currentMode === SIMULATION_MODE || currentMode === SIMULATION_PAUSE_MODE)
    {
        field = simulatedField;
    }
    else
    {
        field = activeField;
    }

    useEffect(() => {
        Rerender();
    }, []);
    
    let cellsInRow: number = 0;
    let cellsInCol: number = 0;
    let canvasSize = {width: 0, height: 0};
    
    if (fieldElement.current) {
        canvasSize.width = fieldElement.current!.clientWidth * (1 + FIELD_OUTSIDE_VIEW * 2);
        canvasSize.height = fieldElement.current!.clientHeight * (1 + FIELD_OUTSIDE_VIEW * 2)

        cellsInRow = Math.ceil(canvasSize.width / cellSize);
        cellsInCol = Math.ceil(canvasSize.height / cellSize);
    }

    function Rerender()
    {
        setRerender(old => {return old + 1;});
        console.log("Re rendered");
    }
    window.onresize = Rerender;
   

    function onMouseDownHandler(event: React.MouseEvent) {
        if (event.button === 2)
        {
            isMouseButton2Down = true;
        }
        else if (event.button === 0)
        {
            
            console.log(event)
            const coord: Coord = {
                x: Math.floor(startCellX + (event.clientX - canvasElement.current!.offsetLeft) / cellSize),
                y: Math.floor(startCellY + (event.clientY - (canvasElement.current!.offsetTop)) / cellSize)};
            dispatch(changeCell(coord));
            dispatch(updateFieldOnServer());
            console.log('canvas', canvasElement.current!.offsetTop);
        }
    }

    function onMouseUpHandler(event: React.MouseEvent) {
        if (event.button === 2) {
            isMouseButton2Down = false;
        }
    }

    function onMouseLeaveHandler() {
        isMouseButton2Down = false;
    }

    function onMouseMoveHandler(event: React.MouseEvent) {
        if (isMouseButton2Down) {
            setCanvasPositionStyle(oldPositionStyle =>
            {
                return normalizeFieldPosition({                    
                    left: oldPositionStyle.left + event.movementX,
                    top: oldPositionStyle.top + event.movementY})
            })
        }
    }
    function onScrollHandler(event: React.WheelEvent) {
        if (event.deltaY > 0) {
            if (cellSize > MIN_CELL_SIZE * (1 + ZOOM_STEP)) {
                setCellSize(old => {
                    return old * (1 - ZOOM_STEP);
                });
                setStartCellX(old => {
                    return old - Math.round(cellsInRow * (ZOOM_STEP / 2));
                })
                setStartCellY(old => {
                    return old - Math.round(cellsInCol * (ZOOM_STEP / 2));
                })
                setCanvasPositionStyle(old => normalizeFieldPosition(old));
            }
            else
            {
                setCellSize(MIN_CELL_SIZE);
            }
        } else {
            if (cellSize < MAX_CELL_SIZE / (1 + ZOOM_STEP)) {
                setCellSize(old => {
                    return old * (1 + ZOOM_STEP);
                });
                setStartCellX(old => {
                    return old + Math.round(cellsInRow * (ZOOM_STEP / 2));
                })
                setStartCellY(old => {
                    return old + Math.round(cellsInCol * (ZOOM_STEP / 2));
                })
                setCanvasPositionStyle(old => normalizeFieldPosition(old));
            }
            else
            {
                setCellSize(MAX_CELL_SIZE);
            }
        }
    }

    function normalizeFieldPosition(fieldStyles: FieldPositionStyle) : FieldPositionStyle  {
        if (!fieldElement.current) return {left: 0, top: 0};
        
        const fieldShiftX = fieldElement.current.clientWidth * FIELD_OUTSIDE_VIEW;
        const fieldShiftY = fieldElement.current.clientHeight * FIELD_OUTSIDE_VIEW;
        
        let newX = fieldStyles.left;
        let newY = fieldStyles.top;

        if (newX < -2*fieldShiftX) {
            while (newX  < fieldShiftX) {
                newX = newX + cellSize;
                setStartCellX(old => {
                    return old + 1;
                });
            }
        }
        if (newX > 0){
            while (newX > -fieldShiftX) {
                newX = newX - cellSize;
                setStartCellX(old => {
                    return old - 1;
                });
            }
        }
        if (newY < -2*fieldShiftY) {
            while (newY  < fieldShiftY) {
                newY = newY + cellSize;
                setStartCellY(old => {
                    return old + 1;
                });
            }
        }
        if (newY > 0){
            while (newY > -fieldShiftY) {
                newY = newY - cellSize;
                setStartCellY(old => {
                    return old - 1;
                });
            }
        }

        return {left: newX, top: newY};
    }

    // const Cells = [];
    
    useMemo(() =>
    {
        if (canvasElement.current)
        {
            const context = canvasElement.current.getContext('2d')!;
            context.strokeStyle = 'black';
            context.fillStyle = "green";
            context.clearRect(0,0,canvasSize.width,canvasSize.height)
            const cellPadding = cellSize / 20;

            if (cellSize > 5) {
                context.lineWidth = cellPadding;
                context.beginPath();
                for (let i = 1; i < cellsInCol; i++) {
                    context.moveTo(0, cellSize * i)
                    context.lineTo(canvasSize.width, cellSize * i)
                }
                for (let i = 1; i < cellsInRow; i++) {
                    context.moveTo(cellSize * i, 0)
                    context.lineTo(cellSize * i, canvasSize.height)
                }
                context.closePath();
                context.stroke();
            }
            
            field.survivors.forEach(({x, y}) =>
            {
                if (x > startCellX || x < startCellX + cellsInCol || y > startCellY || y < startCellY + cellsInRow) 
                context.fillRect(
                    (x - startCellX) * cellSize + cellPadding,
                    (y - startCellY) * cellSize + cellPadding,
                    cellSize - cellPadding * 2,
                    cellSize - cellPadding * 2);                
            })
            console.log('field redrawn')
            
        }
    }, [field, rerender, startCellX, startCellY, cellSize]);

    return (
        <div 
            className={"field"}
            ref={fieldElement}
            onMouseDown={onMouseDownHandler}
            onMouseUp={onMouseUpHandler}
            onMouseMove={onMouseMoveHandler}
            onMouseLeave={onMouseLeaveHandler}
            onWheel={onScrollHandler}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div>
                <canvas
                    ref={canvasElement}
                    style={canvasPositionStyle} className={'field-canvas'}    
                    width={canvasSize.width}
                    height={canvasSize.height}
                >
                    Field is supposed to be here
                </canvas>
                {/*<Stage*/}
                {/*    style={canvasPositionStyle} className={'field-canvas'}    */}
                {/*    width={canvasSize.width}*/}
                {/*    height={canvasSize.height}*/}
                {/*>*/}
                {/*    <Layer>*/}
                {/*        {Cells}*/}
                {/*    </Layer>*/}
                {/*</Stage>*/}
            </div>
        </div>);
};