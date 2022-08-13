import {store} from "../../../redux/Store";
import {setIsMouse2Down} from "../../../redux/FieldDrawingSlice";

export function onMouseLeaveHandler() {
    store.dispatch(setIsMouse2Down(false));
}