import {PositionStyle} from "../../../Types/PositionStyle";
import {Coord} from "../../../Types/Coord";
import {setStartCell} from "../../../redux/FieldDrawingSlice";
import {FIELD_OUTSIDE_VIEW} from "./CanvasField";
import {store} from "../../../redux/Store";

export function normalizeFieldPosition(fieldPosition: PositionStyle) : PositionStyle  {
    const fieldElement = document.getElementById('FieldWrapper');
    const startCell = store.getState().fieldDrawing.StartCell; 
    const cellSize = store.getState().fieldDrawing.CellSize;
    const dispatch = store.dispatch;
        
    if (!fieldElement) return {left: 0, top: 0};

    const fieldShiftX = fieldElement.clientWidth * FIELD_OUTSIDE_VIEW;
    const fieldShiftY = fieldElement.clientHeight * FIELD_OUTSIDE_VIEW;

    let newX = fieldPosition.left;
    let newY = fieldPosition.top;
    const startCellCorrection: Coord = {...startCell};

    if (newX < -2*fieldShiftX) {
        while (newX  < fieldShiftX) {
            newX = newX + cellSize;
            startCellCorrection.x++;
        }
    }
    if (newX > 0){
        while (newX > -fieldShiftX) {
            newX = newX - cellSize;
            startCellCorrection.x--;
        }
    }
    if (newY < -2*fieldShiftY) {
        while (newY  < fieldShiftY) {
            newY = newY + cellSize;
            startCellCorrection.y++;
        }
    }
    if (newY > 0){
        while (newY > -fieldShiftY) {
            newY = newY - cellSize;
            startCellCorrection.y--;
        }
    }

    if (startCellCorrection.x !== startCell.x
        || startCellCorrection.y !== startCell.y)
    {
        dispatch(setStartCell(startCellCorrection));
    }

    return {left: newX, top: newY};
} 