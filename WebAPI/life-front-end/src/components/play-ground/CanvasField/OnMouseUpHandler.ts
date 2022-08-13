import React from "react";
import {setIsMouse2Down} from "../../../redux/FieldDrawingSlice";
import {store} from "../../../redux/Store";

export function onMouseUpHandler(event: React.MouseEvent) {
    
    if (event.button === 2) {
        store.dispatch(setIsMouse2Down(false));
    }
}