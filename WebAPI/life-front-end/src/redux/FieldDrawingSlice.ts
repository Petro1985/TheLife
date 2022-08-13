import {PositionStyle} from "../Types/PositionStyle";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Coord} from "../Types/Coord";

interface FieldDrawing
{
    CanvasPosition: PositionStyle,
    StartCell: Coord,
    CellSize: number,
    IsMouse2Down: boolean,
}

const initialState: FieldDrawing =
    {
        CanvasPosition: {left: 0, top: 0},
        StartCell: {x: 0, y: 0},
        CellSize: 10,
        IsMouse2Down: false,
    };

export const fieldDrawingSlice = createSlice(
{
    name: "FieldDrawing",
    initialState: initialState,
    reducers: {
        setStartCell: (state, action:PayloadAction<Coord>) => {
            state.StartCell = action.payload;
        },
        setCanvasPosition: (state, action:PayloadAction<PositionStyle>) => {
            state.CanvasPosition = action.payload;
        },
        setCellSize: (state, action:PayloadAction<number>) => {
            state.CellSize = action.payload;
        },
        setIsMouse2Down: (state, action:PayloadAction<boolean>) => {
            state.IsMouse2Down = action.payload;
        },
    },
    extraReducers: {}
});

export const {setStartCell, setCanvasPosition, setCellSize, setIsMouse2Down} = fieldDrawingSlice.actions;
export default fieldDrawingSlice.reducer;


