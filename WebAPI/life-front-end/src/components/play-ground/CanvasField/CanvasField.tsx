import React, {useEffect, useRef, useState} from "react";
import './field.css';
import {EDIT_MODE, SIMULATION_MODE, SIMULATION_PAUSE_MODE} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {Coord} from "../../../Types/Coord";
import {changeCell} from "../../../redux/fieldSlice";
import {PositionStyle} from "../../../Types/PositionStyle";
import {updateFieldOnServer} from "../../../ServerApiHandlers/Field/UpdateFieldOnServer";
import ControlBar from "../control-bar/control-bar";

let isMouseButton2Down = false;
const FIELD_OUTSIDE_VIEW = 0.15;
const CELL_PADDING = 1;
const MIN_CELL_SIZE = 2;
const MAX_CELL_SIZE = 90;
const ZOOM_STEP = 0.1;
const INITIAL_CELL_SIZE = 10;

export const CanvasField: React.FC<{enabled: boolean, patternMode: boolean}> = ({enabled, patternMode}) =>
{
    const fieldElement = useRef<HTMLDivElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);

    const [canvasPositionStyle, setCanvasPositionStyle] = useState<PositionStyle>({left: 0 , top:0});

    const [rerender, setRerender] = useState(0)

    const [startCellX, setStartCellX] = useState<number>(0);
    const [startCellY, setStartCellY] = useState<number>(0);

    const [cellSize, setCellSize] = useState<number>(INITIAL_CELL_SIZE);

    const dispatch = useAppDispatch();

    const currentSimulationMode = useAppSelector( state => state.playGround.mode);

    const simulatedField = useAppSelector( state => state.playGround.simulatedField.field.survivors);
    const activeField = useAppSelector( state => state.field.field.survivors);

    let field: Coord[];
    
    if (currentSimulationMode === SIMULATION_MODE || currentSimulationMode === SIMULATION_PAUSE_MODE)
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

    function centerView() {
        if (!field.length) return;

        let maxX: number = field[0].x;
        let minX: number = field[0].x;
        let maxY: number = field[0].y;
        let minY: number = field[0].y;

        field.forEach(x => {
            if (minX > x.x) {
                minX = x.x;
            }
            if (minY > x.y) {
                minY = x.y;
            }
            if (maxX < x.x) {
                maxX = x.x;
            }
            if (maxY < x.y) {
                maxY = x.y;
            }
        });
        // console.log('minX', minX);
        // console.log('minY', minY);
        // console.log('maxX', maxX);
        // console.log('maxY', maxY);
        
        const width = maxX - minX;
        const height = maxY - minY;

        // console.log('width',width);
        // console.log('height',height);
        
        const newCellSize = Math.min(
            fieldElement.current!.clientWidth / width,
            fieldElement.current!.clientHeight / height) * 0.7;

        // console.log('newCellSize', newCellSize);

        const cellsInRow = Math.ceil(canvasElement.current!.clientWidth / newCellSize);
        const cellsInCol = Math.ceil(canvasElement.current!.clientHeight / newCellSize);

        // console.log('cellsInRow', cellsInRow);
        // console.log('cellsInCol', cellsInCol);
        
        const cellsOffsetX = Math.ceil(canvasElement.current!.offsetLeft / newCellSize);
        const cellsOffsetY = Math.ceil(canvasElement.current!.offsetTop / newCellSize);

        // console.log('cellsOffsetX', cellsOffsetX);
        // console.log('cellsOffsetY', cellsOffsetY);

        setStartCellX(minX + cellsOffsetX - Math.floor((cellsInRow - width) / 2.5));
        setStartCellY(minY + cellsOffsetY - Math.floor((cellsInCol-height) / 4));

        // console.log('new startX', minX + cellsOffsetX);
        // console.log('new startY', minY + cellsOffsetY);
        
        setCellSize(newCellSize);           
    }

    useEffect( () =>
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

            field.forEach(({x, y}) =>
            {
                if (x > startCellX || x < startCellX + cellsInCol || y > startCellY || y < startCellY + cellsInRow)
                    context.fillRect(
                        (x - startCellX) * cellSize + cellPadding,
                        (y - startCellY) * cellSize + cellPadding,
                        cellSize - cellPadding * 2,
                        cellSize - cellPadding * 2);
            })
            console.log('field redrawn');
        }
    }, [field, rerender, startCellX, startCellY, cellSize]);

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
        setCanvasPositionStyle(old => normalizeFieldPosition(old));
        console.log("Re rendered");
    }
    window.onresize = Rerender;
   

    function onMouseDownHandler(event: React.MouseEvent) {
        if (!enabled) 
        {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        
        if (event.button === 2)
        {
            isMouseButton2Down = true;
        }
        else if (currentSimulationMode === EDIT_MODE && event.button === 0 && !patternMode)
        {
            console.log('fieldElement.current!.offsetLeft', fieldElement.current!.offsetLeft)
            
            const coord: Coord = {
                x: Math.floor(startCellX + (event.clientX - canvasElement.current!.offsetLeft) / cellSize),
                y: Math.floor(startCellY + (event.clientY - canvasElement.current!.offsetTop) / cellSize)};
            dispatch(changeCell(coord));
            updateFieldOnServer().then();
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
        if (!enabled)
        {
            event.stopPropagation();
            return;
        }
        
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

    function normalizeFieldPosition(fieldStyles: PositionStyle) : PositionStyle  {
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
            <ControlBar
                enabled={enabled}
                centerView={centerView}
            />
            <div>
                <canvas
                    ref={canvasElement}
                    style={canvasPositionStyle} className={'field-canvas'}    
                    width={canvasSize.width}
                    height={canvasSize.height}
                >
                    Field is supposed to be here
                </canvas>
            </div>
        </div>);
};