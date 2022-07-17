import React, {useEffect, useMemo, useRef, useState} from 'react'
import './field.css'
import {changeCell, updateFieldOnServer} from "../../../redux/fieldSlice";
import {EDIT_MODE, SIMULATION_MODE, SIMULATION_PAUSE_MODE} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {SimulatedField} from "../../../Types/SimulatedField";
import {Field} from "../../../Types/Field";
import {Coord} from "../../../Types/Coord";

let isMouseButton2Down = false;
const FIELD_OUTSIDE_VIEW = 0.15;
const CELL_PADDING = 2;
const MIN_CELL_SIZE = 20;
const MAX_CELL_SIZE = 150;
const ZOOM_STEP = 0.2;
const INITIAL_CELL_SIZE = 70;

let Cells:JSX.Element[] = [];


const FieldComponent: React.FC = () => 
{
    const fieldElement = useRef<HTMLDivElement>(null);
    
    const [fieldPositionStyle, setFieldPositionStyle] = useState({left: 0 , top:0});
    
    
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

    const fieldGridStyle:{
        height: number,
        width: number,
        gridTemplateColumns: string
        gridTemplateRows: string
    }  = {height:0, width:0, gridTemplateColumns:'', gridTemplateRows:''};
    
    let cellsInRow = 0;
    let cellsInCol = 0;

    useEffect(() => {
        Rerender();
    }, []);
    
    if (fieldElement.current) {
        const fieldWidth = fieldElement.current.clientWidth * (1 + FIELD_OUTSIDE_VIEW * 2);
        const fieldHeight =  fieldElement.current.clientHeight * (1 + FIELD_OUTSIDE_VIEW * 2);

        cellsInRow = Math.ceil(fieldWidth / cellSize); 
        cellsInCol = Math.ceil(fieldHeight / cellSize);

        fieldGridStyle.height = fieldHeight;
        fieldGridStyle.width = fieldWidth;
        fieldGridStyle.gridTemplateColumns = "repeat(" + cellsInRow + "," + (cellSize) +"px)";
        fieldGridStyle.gridTemplateRows = "repeat(" + cellsInCol + ", " + (cellSize) + "px)";
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
        
    useMemo(() => {
        Cells = [];
        for (let j = startCellY; j < cellsInCol + startCellY; j++) {
            for (let i = startCellX; i < cellsInRow + startCellX; i++) {
                const isAlive = field.survivors.find(element => element.x === i && element.y === j);
                Cells.push(
                    <div
                        onClick={currentMode === EDIT_MODE ? () => onChangeCell({x: i, y: j}) : () => 0}
                        key={i + j * cellsInRow}
                        className={isAlive ? "alive-cell" : "dead-cell"}
                        style={{height: cellSize - CELL_PADDING, width: cellSize - CELL_PADDING}}
                    >
                    </div>);
            }
        }
        console.log("computed");
    }, [activeField, simulatedField, startCellX, startCellY, cellSize, currentMode, rerender]);

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
            setFieldPositionStyle(oldPositionStyle =>
            {
                let newX = oldPositionStyle.left + event.movementX;
                let newY = oldPositionStyle.top + event.movementY;
                return normalizeFieldPosition(newX, newY);
            })
        }        
    }
    
    
    function normalizeFieldPosition(newX: number, newY: number) {
        if (!fieldElement.current) return {left: 0, top: 0};
        
        const fieldShiftX = Math.max(fieldElement.current.clientWidth * FIELD_OUTSIDE_VIEW, cellSize);
        const fieldShiftY = Math.max(fieldElement.current.clientHeight * FIELD_OUTSIDE_VIEW, cellSize);
        
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
                setFieldPositionStyle(old => normalizeFieldPosition(old.left, old.top));
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
                setFieldPositionStyle(old => normalizeFieldPosition(old.left, old.top));
            }
            else
            {
                setCellSize(MAX_CELL_SIZE);
            }
        }
    }

    return (<div
                onMouseDown={onMouseDownHandler}
                onMouseUp={onMouseUpHandler}
                onMouseMove={onMouseMoveHandler}
                onMouseLeave={onMouseLeaveHandler}
                onWheel={onScrollHandler}
                onContextMenu={(e) => e.preventDefault()}
                className={"field"}
                ref={fieldElement}
            >                
                <div 
                    className={'field-grid'}
                    style={{...fieldPositionStyle, ...fieldGridStyle}}
                >
                    {Cells}
                </div>
            </div>);
}

export default FieldComponent;