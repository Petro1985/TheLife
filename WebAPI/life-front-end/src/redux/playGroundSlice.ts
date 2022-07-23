﻿import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./Store";
import {FieldWithoutId} from "../Types/SimulationFieldResponse";
import {StartNewFieldSimulationServerAPI} from "../ServerApiHandlers/StartFieldSimulation";
export const EDIT_MODE = "EDIT_MODE";
export const SIMULATION_MODE = "SIMULATION_MODE";
export const SIMULATION_PAUSE_MODE = "SIMULATION_PAUSE_MODE";

// size of buffer for simulation in seconds
export const SIMULATION_FIELD_BUFFER_SIZE = 5;

const initialState: PlayGround = {
    mode: EDIT_MODE,
    intervalId: 0,
    interval: 500,
    simulatedField: {
        id: "",
        field: {survivors: []},
        fieldBuffer: [{survivors: []}]
    }, 
};

interface PlayGround
{
    mode: string,
    intervalId: number,
    interval: number,
    simulatedField: {id: string, field: FieldWithoutId, fieldBuffer: FieldWithoutId[]},
}

export const startNewFieldSimulation = createAsyncThunk<
    {id: string, field: FieldWithoutId[]},
    number,
    {
        state: RootState,
        dispatch: AppDispatch,
    }
    >('playground/StartNewFieldSimulation', async (fieldId, {dispatch, getState}) =>
{
    try {
        return await StartNewFieldSimulationServerAPI(fieldId);
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
        return {id:"", field: [{survivors:[]}]};
    }    
});

export const playGroundSlice = createSlice({
    name: 'playGround',
    initialState,
    reducers: {
        addTurnsToBuffer: (state, {payload}) =>
        {
            if (state.simulatedField.fieldBuffer.length){
                state.simulatedField.fieldBuffer = state.simulatedField.fieldBuffer.concat(payload);
            }
            else
            {
                state.simulatedField.fieldBuffer = payload;
            }
        },
        makeSimulationTurn: (state) =>
        {
            const newField = state.simulatedField.fieldBuffer.shift();
            if (newField) 
            {
                state.simulatedField.field = newField;
            }
        },
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
        setSimulationInterval: (state, action: PayloadAction<number>) =>
        {
            state.interval = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(startNewFieldSimulation.fulfilled, (state, {payload}) =>
            {
                state.mode = SIMULATION_MODE;
                state.simulatedField.id = payload.id;
                state.simulatedField.field.survivors = payload.field[0].survivors;
                state.simulatedField.fieldBuffer = [{survivors: payload.field[1].survivors}];
            }
        )        
    }
});

export const {setIntervalId, setSimulationMode, setSimulationInterval, makeSimulationTurn, addTurnsToBuffer} = playGroundSlice.actions;
export default playGroundSlice.reducer;