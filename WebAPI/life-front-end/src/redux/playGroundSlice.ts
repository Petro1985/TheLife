import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./Store";
import {RequestSimulationTurns} from "../ServerApiHandlers/RequestSimulationTurns";
import {FieldWithoutId, SimulationFieldResponse} from "../Types/SimulationFieldResponse";
export const EDIT_MODE = "EDIT_MODE";
export const SIMULATION_MODE = "SIMULATION_MODE";
export const SIMULATION_PAUSE_MODE = "SIMULATION_PAUSE_MODE";


const SIMULATION_FIELD_BUFFER_SIZE = 20;
const COUNT_OF_TURNS_FOR_ONE_REQUEST = 2;

const initialState: PlayGround = {
    mode: EDIT_MODE,
    intervalId: 0,
    interval: 1000,
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

export const requestSimulationTurns = createAsyncThunk<
    FieldWithoutId[],
    void,
    {
        state: RootState,
        dispatch: AppDispatch,
    }>(
    'playGround/makeTurn',
    async (_, {getState, fulfillWithValue}) => {
        const state = getState().playGround;

        let countTurns: number = 1;
        
        if (state.simulatedField.fieldBuffer.length < SIMULATION_FIELD_BUFFER_SIZE)
        {
            countTurns = 2;
        } else if (state.simulatedField.fieldBuffer.length > SIMULATION_FIELD_BUFFER_SIZE * 1.2)
        {
            countTurns = 0;
        }
        if (countTurns) 
        {
            const simulatedField: SimulationFieldResponse = await RequestSimulationTurns(state.simulatedField.id, countTurns);
            console.log('->',simulatedField);
            return simulatedField.field;
        }
        else
        {
            return [];
        }

    }
)

export const playGroundSlice = createSlice({
    name: 'playGround',
    initialState,
    reducers: {
        makeSimulationTurn: (state) =>
        {
            const newField = state.simulatedField.fieldBuffer.shift()
            if (newField)
                state.simulatedField.field = newField;
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
        setSimulatedField: (state, action:PayloadAction<SimulationFieldResponse>) =>
        {
            state.simulatedField.id = action.payload.id;
            state.simulatedField.field.survivors = action.payload.field[0].survivors;
            state.simulatedField.fieldBuffer = [{survivors: action.payload.field[1].survivors}];
        },
        setSimulationInterval: (state, action: PayloadAction<number>) =>
        {
            state.interval = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestSimulationTurns.fulfilled, (state, {payload}) => {
            console.log('payload -> ', payload)
            console.log('state buffer ->', state.simulatedField.fieldBuffer.length)

            if (state.simulatedField.fieldBuffer.length){
                state.simulatedField.fieldBuffer = state.simulatedField.fieldBuffer.concat(payload);
            }
            else
            {
                state.simulatedField.fieldBuffer = payload;
            }
            
            console.log(`Request has been fulfilled count=${payload.length}`, state.simulatedField);
        });
    }
});

export const {setIntervalId, setSimulationMode, setSimulatedField, setSimulationInterval, makeSimulationTurn} = playGroundSlice.actions;
export default playGroundSlice.reducer;