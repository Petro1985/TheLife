import React from "react";
import {setCanvasPosition, setCellSize, setStartCell} from "../../../redux/FieldDrawingSlice";
import {normalizeFieldPosition} from "./NormalizeFieldPosition";
import {store} from "../../../redux/Store";
import {MENU_MODE} from "../../../redux/playGroundSlice";
import {MAX_CELL_SIZE, MIN_CELL_SIZE, ZOOM_STEP} from "./CanvasField";

export function onScrollHandler(event: React.WheelEvent, cellsInRow:number, cellsInCol: number) {
    const state = store.getState();
    const dispatch = store.dispatch;
    const currentMode = state.playGround.mode;
    const cellSize = state.fieldDrawing.CellSize;
    const startCell = state.fieldDrawing.StartCell;
    const canvasPosition = state.fieldDrawing.CanvasPosition;
    
    if (currentMode === MENU_MODE)
    {
        event.stopPropagation();
        return;
    }

    if (event.deltaY > 0) {
        if (cellSize > MIN_CELL_SIZE * (1 + ZOOM_STEP)) {
            dispatch(setCellSize(cellSize * (1 - ZOOM_STEP)));

            dispatch(setStartCell(
                {
                    x: startCell.x - Math.round(cellsInRow * (ZOOM_STEP / 2)),
                    y: startCell.y - Math.round(cellsInCol * (ZOOM_STEP / 2)),
                }
            ))

            dispatch(setCanvasPosition(normalizeFieldPosition(canvasPosition)))
        }
        else
        {
            setCellSize(MIN_CELL_SIZE);
        }
    } else {
        if (cellSize < MAX_CELL_SIZE / (1 + ZOOM_STEP)) {
            dispatch(setCellSize(cellSize * (1 + ZOOM_STEP)));

            dispatch(setStartCell(
                {
                    x: startCell.x + Math.round(cellsInRow * (ZOOM_STEP / 2)),
                    y: startCell.y + Math.round(cellsInCol * (ZOOM_STEP / 2)),
                }
            ))

            dispatch(setCanvasPosition(normalizeFieldPosition(canvasPosition)))

        }
        else
        {
            dispatch(setCellSize(MAX_CELL_SIZE));
        }
    }
}