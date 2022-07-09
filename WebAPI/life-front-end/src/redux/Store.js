import { configureStore } from "@reduxjs/toolkit";
import fieldReducer from "./fieldSlice";
import menuReducer from "./menuSlice";
import playGroundReducer from "./playGroundSlice";

export const store = configureStore({
    reducer: {
        field: fieldReducer,
        menu: menuReducer,
        playGround: playGroundReducer,
    },
});

