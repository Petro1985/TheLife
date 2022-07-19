import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SimulatedField} from "../Types/SimulatedField";
import {AppDispatch, RootState} from "./Store";
import {MakeSimulationTurn} from "../ServerApiHandlers/MakeSimulationTurn";
import {fetchFieldById} from "./fieldSlice";
import {log} from "util";
export const EDIT_MODE = "EDIT_MODE";
export const SIMULATION_MODE = "SIMULATION_MODE";
export const SIMULATION_PAUSE_MODE = "SIMULATION_PAUSE_MODE";

const initialState: PlayGround = {
    mode: EDIT_MODE,
    intervalId: 0,
    interval: 50,
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

export const makeSimulationTurn = createAsyncThunk<
    SimulatedField,
    void,
    {
        state: RootState,
        dispatch: AppDispatch,
        // fulfilledValue: SimulatedField,
        // FulfilledMeta: SimulatedField,
    }>(
        'playGround/makeTurn',
    async (_, {getState, fulfillWithValue}) => {
        const state = getState().playGround;
        const simulatedField: SimulatedField = await MakeSimulationTurn(state.simulatedField.id);
        console.log('->',simulatedField);
        return simulatedField;
    }
)

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
            console.log('interval ID set ->', action.payload);
        },
        clearIntervalId: (state) =>
        {
            state.intervalId = 0;
        },
        setSimulatedField: (state, action: PayloadAction<SimulatedField>) =>
        {
            state.simulatedField = action.payload;
        },
        setSimulationInterval: (state, action: PayloadAction<number>) =>
        {
            state.interval = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(makeSimulationTurn.fulfilled, (state, {payload}) => {
            state.simulatedField = payload!;
            console.log("Request has been fulfilled", state.simulatedField);
        });
    }
});

export const {setIntervalId, setSimulationMode, setSimulatedField, setSimulationInterval} = playGroundSlice.actions;
export default playGroundSlice.reducer;