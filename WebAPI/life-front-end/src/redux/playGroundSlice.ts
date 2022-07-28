import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./Store";
import {FieldWithoutId} from "../Types/SimulationFieldResponse";
import {startNewFieldSimulationServerAPI} from "../ServerApiHandlers/Simulation/StartFieldSimulation";
export const MENU_MODE = "MENU_MODE";
export const EDIT_MODE = "EDIT_MODE";
export const SIMULATION_MODE = "SIMULATION_MODE";
export const SIMULATION_PAUSE_MODE = "SIMULATION_PAUSE_MODE";

// size of buffer for simulation in seconds
export const SIMULATION_FIELD_BUFFER_SIZE = 10;

const initialState: PlayGround = {
    mode: EDIT_MODE,
    intervalId: 0,
    interval: 300,
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
        const state = getState();
        const currentSurvivors = state.field.field.survivors;
        const nextTurn = await startNewFieldSimulationServerAPI(currentSurvivors);
        nextTurn.field.unshift({survivors: currentSurvivors});
        return nextTurn;
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
        return {id:"", field:[]};
    }    
});

export const playGroundSlice = createSlice({
    name: 'playGround',
    initialState,
    reducers: {
        addTurnsToBuffer: (state, action:PayloadAction<FieldWithoutId[]>) =>
        {
            if (state.simulatedField.fieldBuffer.length){
                state.simulatedField.fieldBuffer = state.simulatedField.fieldBuffer.concat(action.payload);
            }
            else
            {
                state.simulatedField.fieldBuffer = action.payload;
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
                state.simulatedField.field = payload.field[0];
                state.simulatedField.fieldBuffer = payload.field;
            }
        )        
    }
});

export const {setIntervalId, setSimulationMode, setSimulationInterval, makeSimulationTurn, addTurnsToBuffer} = playGroundSlice.actions;
export default playGroundSlice.reducer;