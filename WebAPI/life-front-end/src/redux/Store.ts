import { configureStore } from "@reduxjs/toolkit";
import fieldReducer from "./fieldSlice";
import menuReducer from "./menuSlice";
import playGroundReducer from "./playGroundSlice";
import fieldDrawingReducer from './FieldDrawingSlice'

export const store = configureStore({
    reducer: {
        field: fieldReducer,
        fieldDrawing: fieldDrawingReducer,
        menu: menuReducer,
        playGround: playGroundReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
        serializableCheck: false        
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

