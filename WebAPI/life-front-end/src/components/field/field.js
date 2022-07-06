import React, {useEffect, useRef, useState} from 'react'
import './field.css'
import {useDispatch, useSelector} from "react-redux";
import {changeCell, updateFieldOnServer} from "../../redux/fieldSlice";
let isMouseButton2Down = false;
let CELL_SIZE;

export default function Field(props) {
    const Cells = [];
 
    const cell = useRef(null);

    const [fieldPositionStyle, setFieldPositionStyle] = useState({left:0 , top:0});
    

    // -1 is used because there is an additional row and col outside the field view
    const [startCellX, setStartCellX] = useState(-1);
    const [startCellY, setStartCellY] = useState(-1);

    const [cellsOnField, setCellsOnField] = useState(12);

    const dispatch = useDispatch();
    const field = useSelector( state => state.field.field);

    
    async function onChangeCell(coord) {
        dispatch(changeCell({...coord, updateOnServer: true}));
        dispatch(updateFieldOnServer());
        console.log(coord);
        console.log("StartCellX", startCellX)

    }
    
    useEffect(() => {
        CELL_SIZE = cell.current.clientWidth;
    },[]);
    
    for (let j = startCellY; j < cellsOnField + startCellY; j++)
    {
        const row = [];
        for (let i = startCellX; i < cellsOnField + startCellX; i++)
        {
            const isAlive =  field.survivors.find(element => element.x === i && element.y === j);
            row.push(
                <div 
                    ref={cell}
                    onClick={() => onChangeCell({x:i, y:j})} 
                    key={i + j * cellsOnField} 
                    className={isAlive ? "alive-cell" : "dead-cell"}>                        
                </div>);
        }
        Cells.push(<div key={"FieldRow" + j} className={"row"}>{row}</div>)
    }
    

    function onMouseDownHandler(event) {
        if (event.button === 2)
        {
            isMouseButton2Down = true;
        }        
        console.log(isMouseButton2Down)
    }

    function onMouseUpHandler(event) {
        if (event.button === 2) {
            isMouseButton2Down = false;
        }
        console.log(isMouseButton2Down)
    }

    function onMouseLeaveHandler() {
        isMouseButton2Down = false;
        console.log(isMouseButton2Down);
    }

    function onMouseMoveHandler(event) {
        if (isMouseButton2Down) {
            setFieldPositionStyle(oldPositionStyle =>
            {
                const newPosition = {...oldPositionStyle};
                let newX = newPosition.left + event.movementX;
                let newY = newPosition.top + event.movementY;

                // console.log('newX =',newX,' CellSize =',CELL_SIZE)
                while (newX < -CELL_SIZE)
                {
                    newX = newX + CELL_SIZE;

                    setStartCellX(old => {return old + 0.5;});
                }
                while (newX > CELL_SIZE)
                {
                    newX = newX - CELL_SIZE;

                    setStartCellX(old => {return old - 0.5;});
                }
                while (newY < -CELL_SIZE)
                {
                    newY = newY + CELL_SIZE;

                    setStartCellY(old => {return old + 0.5;});
                }
                while (newY > CELL_SIZE)
                {
                    newY = newY - CELL_SIZE;

                    setStartCellY(old => {return old - 0.5;});
                }
                
                newPosition.left = newX;
                newPosition.top = newY;
                // console.log(newPosition)
                return newPosition;
            })
        }        
    }

    function onScrollHandler(event) {
        if (event.deltaY > 0) {
            setCellsOnField(old => {return old + 1;});
        } else {
            setCellsOnField(old => {return old - 1;});
        }
    }

    return (<div
                onMouseDown={onMouseDownHandler}
                onMouseUp={onMouseUpHandler}
                onMouseMove={onMouseMoveHandler}
                onMouseLeave={onMouseLeaveHandler}
                onWheel={onScrollHandler}
                onContextMenu={(e) => e.preventDefault()}
                className={"field"}>
                <div className={'field-wrapper'} style={fieldPositionStyle}>
                    {Cells}
                </div>
            </div>);
}
