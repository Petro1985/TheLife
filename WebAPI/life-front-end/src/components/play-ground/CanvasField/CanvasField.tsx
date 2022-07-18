import React, {useEffect, useMemo, useRef, useState} from "react";
import {Text, Circle, Layer, Line, Rect, Stage} from "react-konva";
import '../field/field.css';
import {EDIT_MODE, SIMULATION_MODE, SIMULATION_PAUSE_MODE} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {SimulatedField} from "../../../Types/SimulatedField";
import {Field} from "../../../Types/Field";
import {Coord} from "../../../Types/Coord";
import {changeCell, updateFieldOnServer} from "../../../redux/fieldSlice";

let isMouseButton2Down = false;
const FIELD_OUTSIDE_VIEW = 0.15;
const CELL_PADDING = 1;
const MIN_CELL_SIZE = 2;
const MAX_CELL_SIZE = 150;
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


        console.log('cellsInRow', cellsInRow)
        console.log('cellsInCol', cellsInCol)
        console.log('StartX', startCellX)
        console.log('StartY', startCellY)
    }

    function Rerender()
    {
        setRerender(old => {return old + 1;});
        console.log("Re rendered");
    }
    window.onresize = Rerender;

    async function onChangeCell(coord: Coord) {
        dispatch(changeCell(coord));
        dispatch(updateFieldOnServer());
    }    
    

    function onMouseDownHandler(event: React.MouseEvent) {
        if (event.button === 2)
        {
            isMouseButton2Down = true;
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
                // setStartCellX(old => {
                //     return old - Math.round(cellsInRow * (ZOOM_STEP / 2));
                // })
                // setStartCellY(old => {
                //     return old - Math.round(cellsInCol * (ZOOM_STEP / 2));
                // })
                //setCanvasPositionStyle(old => normalizeFieldPosition(old));
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
                // setStartCellX(old => {
                //     return old + Math.round(cellsInRow * (ZOOM_STEP / 2));
                // })
                // setStartCellY(old => {
                //     return old + Math.round(cellsInCol * (ZOOM_STEP / 2));
                // })
                //setCanvasPositionStyle(old => normalizeFieldPosition(old));
            }
            else
            {
                setCellSize(MAX_CELL_SIZE);
            }
        }
    }

    function normalizeFieldPosition(fieldStyles: FieldPositionStyle) : FieldPositionStyle  {
        if (!fieldElement.current) return {left: 0, top: 0};
        
        const fieldShiftX = Math.max(fieldElement.current.clientWidth * FIELD_OUTSIDE_VIEW, cellSize);
        const fieldShiftY = Math.max(fieldElement.current.clientHeight * FIELD_OUTSIDE_VIEW, cellSize);
        
        let newX = fieldStyles.left;
        let newY = fieldStyles.top;

        while (newX + fieldShiftX < -cellSize) {
            newX = newX + cellSize;
            setStartCellX(old => {
                return old + 1;
            });
        }
        while (newX + fieldShiftX > cellSize) {
            newX = newX - cellSize;
            setStartCellX(old => {
                return old - 1;
            });
        }
        while (newY + fieldShiftY < -cellSize) {
            newY = newY + cellSize;
            setStartCellY(old => {
                return old + 1;
            });
        }
        while (newY + fieldShiftY > cellSize) {
            newY = newY - cellSize;
            setStartCellY(old => {
                return old - 1;
            });
        }
        return {left: newX, top: newY};
    }

    const Cells = [];
    for (let j = startCellY; j < cellsInCol + startCellY; j++) {
        for (let i = startCellX; i < cellsInRow + startCellX; i++) {
            const isAlive = field.survivors.find(element => element.x === i && element.y === j);
            Cells.push(
                <Rect
                    key={i + j * cellsInRow}
                    onClick={currentMode === EDIT_MODE ? () => onChangeCell({x: i, y: j}) : () => 0}
                    x={(i - startCellX) * cellSize + CELL_PADDING}
                    y={(j - startCellY) * cellSize + CELL_PADDING}
                    width={(cellSize - CELL_PADDING*2)}
                    height={(cellSize - CELL_PADDING*2)}
                    fill={isAlive? "green" : "#aaaaaa"}
                    // shadowBlur={10}
                />);
        }
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
            <div>
                <Stage
                    style={canvasPositionStyle} className={'field-canvas'}    
                    width={canvasSize.width}
                    height={canvasSize.height}
                >
                    <Layer>
                        {Cells}
                    </Layer>
                </Stage>
            </div>
        </div>);
};