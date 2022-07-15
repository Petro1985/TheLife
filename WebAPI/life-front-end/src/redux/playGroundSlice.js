import {createSlice} from "@reduxjs/toolkit";
export const EDIT_MODE = "EDIT_MODE";
export const SIMULATION_MODE = "SIMULATION_MODE";
export const SIMULATION_PAUSE_MODE = "SIMULATION_PAUSE_MODE";

const initialState = {
    mode: EDIT_MODE,
    intervalId: 0,
    interval: 1000,
    simulatedField: {
        id: -1,
        survivors: []
    }
};

export const playGroundSlice = createSlice({
    name: 'playGround',
    initialState,
    reducers: {
        setSimulationMode: (state, action) =>
        {
            state.mode = action.payload;
        },
        setIntervalId: (state, action) =>
        {
            state.intervalId = action.payload;
        },
        clearIntervalId: (state, action) =>
        {
            state.intervalId = null;
        },
        setSimulatedField: (state, action) =>
        {
            state.simulatedField = action.payload;
        }        
    }
});

export const {setIntervalId, setSimulationMode, setSimulatedField} = playGroundSlice.actions;
export default playGroundSlice.reducer;