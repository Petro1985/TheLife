import React from "react";
import {setCanvasPosition} from "../../../redux/FieldDrawingSlice";
import {store} from "../../../redux/Store";
import {normalizeFieldPosition} from "./NormalizeFieldPosition";
import {Coord} from "../../../Types/Coord";
import {setCellAlive, setCellDead} from "../../../redux/fieldSlice";
import {EDIT_MODE} from "../../../redux/playGroundSlice";

export function onMouseMoveHandler(event: React.MouseEvent) {
    const canvasPositionStyle = store.getState().fieldDrawing.CanvasPosition;
    const isMouseButton2Down = store.getState().fieldDrawing.IsMouse2Down;
    const startCell = store.getState().fieldDrawing.StartCell;
    const cellSize = store.getState().fieldDrawing.CellSize;
    const currentMode = store.getState().playGround.mode;
    const dispatch = store.dispatch;

    const canvasElement = document.getElementById('FieldCanvas');
    
    if (isMouseButton2Down) {
        dispatch(
            setCanvasPosition(
                normalizeFieldPosition(
                    {
                        left: canvasPositionStyle.left + event.movementX,
                        top: canvasPositionStyle.top + event.movementY
                    }
                )
            )
        )
    }
    else if (currentMode === EDIT_MODE)
    {
        if (event.buttons % 2 && !event.ctrlKey)
        {
            const coord: Coord = {
                x: Math.floor(startCell.x + (event.clientX - canvasElement!.offsetLeft) / cellSize),
                y: Math.floor(startCell.y + (event.clientY - canvasElement!.offsetTop) / cellSize)};
            dispatch(setCellAlive(coord));
        }
        else if ((event.buttons / 4) % 2 || event.buttons % 2 && event.ctrlKey)
        {
            const coord: Coord = {
                x: Math.floor(startCell.x + (event.clientX - canvasElement!.offsetLeft) / cellSize),
                y: Math.floor(startCell.y + (event.clientY - canvasElement!.offsetTop) / cellSize)};
            dispatch(setCellDead(coord));
        }
    }
}