import React from "react";
import {setCanvasPosition} from "../../../redux/FieldDrawingSlice";
import {store} from "../../../redux/Store";
import {normalizeFieldPosition} from "./NormalizeFieldPosition";

export function onMouseMoveHandler(event: React.MouseEvent) {
    const canvasPositionStyle = store.getState().fieldDrawing.CanvasPosition;
    const isMouseButton2Down = store.getState().fieldDrawing.IsMouse2Down;
    const dispatch = store.dispatch;
    
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
}