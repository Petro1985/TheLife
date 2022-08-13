import React, {useEffect, useRef, useState} from "react";
import './field.css';
import {SIMULATION_MODE, SIMULATION_PAUSE_MODE} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {Coord} from "../../../Types/Coord";
import {setCanvasPosition, setCellSize, setStartCell} from "../../../redux/FieldDrawingSlice";
import {onMouseDownHandler} from "./OnMouseDownHandler";
import {onMouseUpHandler} from "./OnMouseUpHandler";
import {normalizeFieldPosition} from "./NormalizeFieldPosition";
import {onMouseMoveHandler} from "./OnMouseMoveHandler";
import {onMouseLeaveHandler} from "./OnMouseLeaveHandler";
import {onScrollHandler} from "./OnScrollHandler";

export const FIELD_OUTSIDE_VIEW = 0.15;
export const MIN_CELL_SIZE = 0;
export const MAX_CELL_SIZE = 90;
export const ZOOM_STEP = 0.1;

export const CanvasField: React.FC<{enabled: boolean, patternMode: boolean}> = ({enabled, patternMode}) =>
{
    const fieldElement = useRef<HTMLDivElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);

    const [rerender, setRerender] = useState(0)
    const dispatch = useAppDispatch();

    const startCell = useAppSelector(state => state.fieldDrawing.StartCell);
    const cellSize = useAppSelector(state => state.fieldDrawing.CellSize);
    const canvasPositionStyle = useAppSelector(state => state.fieldDrawing.CanvasPosition);
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
        window.onresize = Rerender;
    }, []);

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
                if (x > startCell.x || x < startCell.x + cellsInCol || y > startCell.y || y < startCell.y + cellsInRow)
                    context.fillRect(
                        (x - startCell.x) * cellSize + cellPadding,
                        (y - startCell.y) * cellSize + cellPadding,
                        cellSize - cellPadding * 2,
                        cellSize - cellPadding * 2);
            })
            console.log('field redrawn');
        }
    }, [field, rerender, startCell, cellSize]);

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
        dispatch(setCanvasPosition(normalizeFieldPosition(canvasPositionStyle)))
        console.log("Re rendered");
    }

    return (
        <div 
            className={"field"}
            id={'FieldWrapper'}
            ref={fieldElement}
            onMouseDown={onMouseDownHandler}
            onMouseUp={onMouseUpHandler}
            onMouseMove={onMouseMoveHandler}
            onMouseLeave={onMouseLeaveHandler}
            onWheel={(e) => onScrollHandler(e, cellsInRow, cellsInCol)}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div>
                <canvas
                    id={'FieldCanvas'}
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