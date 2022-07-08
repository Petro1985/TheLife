import React, {useEffect, useRef, useState} from 'react'
import './field.css'
import {useDispatch, useSelector} from "react-redux";
import {changeCell, updateFieldOnServer} from "../../redux/fieldSlice";

let isMouseButton2Down = false;
const FIELD_OUTSIDE_VIEW = 0.15;
const CELL_PADDING = 2;
const MIN_CELL_SIZE = 20;
const MAX_CELL_SIZE = 150;
const ZOOM_STEP = 0.2;

export default function Field(props) {
    const Cells = [];
 
    const fieldElement = useRef(null);
    
    const [fieldPositionStyle, setFieldPositionStyle] = useState({left: 0 , top:0});
    const [rerender, setRerender] = useState(0)

    // -3 is used because there is an additional row and col outside the field view
    const [startCellX, setStartCellX] = useState(0);
    const [startCellY, setStartCellY] = useState(0);

    const [cellSize, setCellSize] = useState(70);

    const dispatch = useDispatch();
    const field = useSelector( state => state.field.field);

    const fieldGridStyle = {}
    
    let cellsInRow = 0;
    let cellsInCol = 0;

    useEffect(() => {
        Rerender();
    }, []);
    
    if (fieldElement.current) {
        const fieldWidth = fieldElement.current.clientWidth;
        const fieldHeight =  fieldElement.current.clientHeight;

        cellsInRow = Math.ceil(fieldWidth * (1 + FIELD_OUTSIDE_VIEW * 2) / cellSize); 
        cellsInCol = Math.ceil(fieldHeight * (1 + FIELD_OUTSIDE_VIEW * 2)  / cellSize);

        fieldGridStyle.height = cellsInCol * cellSize;
        fieldGridStyle.width = cellsInRow * cellSize;
        
        fieldGridStyle.gridTemplateColumns = "repeat(" + cellsInRow + "," + (cellSize) +"px)";
        fieldGridStyle.gridTemplateRows = "repeat(" + cellsInCol + ", " + (cellSize) + "px)";
    }
        
    function Rerender()
    {
        setRerender(old => {return old + 1;});
        console.log("Re rendered");
    }
    window.onresize = Rerender;
        
    async function onChangeCell(coord) {
        dispatch(changeCell({...coord, updateOnServer: true}));
        dispatch(updateFieldOnServer());
    }
    
    
    for (let j = startCellY; j < cellsInCol + startCellY; j++)
    {
        for (let i = startCellX; i < cellsInRow + startCellX; i++)
        {
            const isAlive =  field.survivors.find(element => element.x === i && element.y === j);
            Cells.push(
                <div 
                    onClick={() => onChangeCell({x:i, y:j})} 
                    key={i + j * cellsInRow} 
                    className={isAlive ? "alive-cell" : "dead-cell"}
                    style={{height: cellSize - CELL_PADDING, width: cellSize - CELL_PADDING}}
                >                        
                </div>);
        }        
    }   

    function onMouseDownHandler(event) {
        if (event.button === 2)
        {
            isMouseButton2Down = true;
        }        
    }

    function onMouseUpHandler(event) {
        if (event.button === 2) {
            isMouseButton2Down = false;
        }
    }

    function onMouseLeaveHandler() {
        isMouseButton2Down = false;
    }

    function onMouseMoveHandler(event) {
        if (isMouseButton2Down) {
            setFieldPositionStyle(oldPositionStyle =>
            {
                let newX = oldPositionStyle.left + event.movementX;
                let newY = oldPositionStyle.top + event.movementY;
                return normalizeFieldPosition(newX, newY);
            })
        }        
    }
    
    function normalizeFieldPosition(newX, newY) {
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

    function onScrollHandler(event) {
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
