import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SimulatedField} from "../Types/SimulatedField";
export const EDIT_MODE = "EDIT_MODE";
export const SIMULATION_MODE = "SIMULATION_MODE";
export const SIMULATION_PAUSE_MODE = "SIMULATION_PAUSE_MODE";

const initialState: PlayGround = {
    mode: EDIT_MODE,
    intervalId: 0,
    interval: 1000,
    simulatedField: {
        id: "",
        survivors: []
    }
};

interface PlayGround
{
    mode: string,
    intervalId: number,
    interval: number,
    simulatedField: SimulatedField
}

export const playGroundSlice = createSlice({
    name: 'playGround',
    initialState,
    reducers: {
        setSimulationMode: (state, action: PayloadAction<string>) =>
        {
            state.mode = action.payload;
        },
        setIntervalId: (state, action: PayloadAction<number>) =>
        {
            state.intervalId = action.payload;
        },
        clearIntervalId: (state) =>
        {
            state.intervalId = 0;
        },
        setSimulatedField: (state, action: PayloadAction<SimulatedField>) =>
        {
            state.simulatedField = action.payload;
        }        
    }
});

export const {setIntervalId, setSimulationMode, setSimulatedField} = playGroundSlice.actions;
export default playGroundSlice.reducer;