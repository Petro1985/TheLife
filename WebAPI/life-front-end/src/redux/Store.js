import { configureStore } from "@reduxjs/toolkit";
import fieldReducer from "./fieldSlice";
import menuReducer from "./menuSlice";

export const store = configureStore({
    reducer: {
        field: fieldReducer,
        menu: menuReducer,
    },
});

