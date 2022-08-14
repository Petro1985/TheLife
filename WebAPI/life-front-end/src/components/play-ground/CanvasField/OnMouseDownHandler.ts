import React from "react";
import {EDIT_MODE, MENU_MODE} from "../../../redux/playGroundSlice";
import {Coord} from "../../../Types/Coord";
import {changeCell, setCellAlive, setCellDead} from "../../../redux/fieldSlice";
import {updateFieldOnServer} from "../../../ServerApiHandlers/Field/UpdateFieldOnServer";
import {store} from "../../../redux/Store";
import {setIsMouse2Down} from "../../../redux/FieldDrawingSlice";

export function onMouseDownHandler(event: React.MouseEvent) {
    const currentSimulationMode = store.getState().playGround.mode;
    const cellSize = store.getState().fieldDrawing.CellSize;
    const startCell = store.getState().fieldDrawing.StartCell;
    
    const canvasElement = document.getElementById('FieldCanvas');
    const fieldElement = document.getElementById('FieldWrapper');
    
    const dispatch = store.dispatch;    
    
    if (currentSimulationMode === MENU_MODE)
    {
        event.stopPropagation();
        event.preventDefault();
        return;
    }

    if (event.button === 2)
    {
        dispatch(setIsMouse2Down(true));
    }
    else if (currentSimulationMode === EDIT_MODE && event.button === 0 && !event.ctrlKey)
    {
        console.log('fieldElement.current!.offsetLeft', fieldElement!.offsetLeft)

        const coord: Coord = {
            x: Math.floor(startCell.x + (event.clientX - canvasElement!.offsetLeft) / cellSize),
            y: Math.floor(startCell.y + (event.clientY - canvasElement!.offsetTop) / cellSize)};
        dispatch(setCellAlive(coord));
        updateFieldOnServer().then();
    }
    else if (currentSimulationMode === EDIT_MODE && event.button === 0 && event.ctrlKey)
    {
        console.log('fieldElement.current!.offsetLeft', fieldElement!.offsetLeft)

        const coord: Coord = {
            x: Math.floor(startCell.x + (event.clientX - canvasElement!.offsetLeft) / cellSize),
            y: Math.floor(startCell.y + (event.clientY - canvasElement!.offsetTop) / cellSize)};
        dispatch(setCellDead(coord));
        updateFieldOnServer().then();
    }
}