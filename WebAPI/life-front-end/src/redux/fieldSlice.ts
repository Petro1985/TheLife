import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SERVER_ADDRESS} from "../Utilities/serverAddress";
import {createNewFieldOnServer} from "../ServerApiHandlers/UpdateFieldOnServer";
import {AppDispatch, RootState} from "./Store";
import {Coord} from "../Types/Coord";
import {Field} from "../Types/Field";

interface IField
{
    field: Field
}

const initialState : IField = {
    field: {id:-1, name:'', survivors: []}
}

export const createNewField = createAsyncThunk<
    Field | null,
    void,
    {
        dispatch: AppDispatch,
        state: RootState,
        fulfillWithValue: (Field)
    }
    >('field/createNewField', async (_,{fulfillWithValue, rejectWithValue, dispatch}) => {
    try {
        const newField : Field = {"survivors": [], "name": "", id: 0};
        newField.id = await createNewFieldOnServer()

        fulfillWithValue(newField);
        return newField;
    }
    catch (e)
    {
        return null;
    }
})

export const updateFieldOnServer = createAsyncThunk<
    void,
    void,
    {
        dispatch: AppDispatch
        state: RootState
    }
    >(
    'field/updateFieldOnServer', 
    async (_, thunkAPI) => {
        try {
            const field = thunkAPI.getState().field.field;
            
            const bodyContent =  JSON.stringify({"survivors": field.survivors, "name": field.name});
    
            await fetch(SERVER_ADDRESS + '/Map/' + field.id, 
                {
                    mode: "cors", 
                    credentials: "include", 
                    headers: {'Content-Type': 'application/json'}, 
                    method: "PUT", 
                    body: bodyContent
                });
        }
        catch (e)
        {
            thunkAPI.rejectWithValue("error during updating field: " + e);
        }
})

export const fetchFieldById = createAsyncThunk<
    Field,
    number,
    {
        dispatch: AppDispatch,
        state: RootState,
        fulfillWithValue: (Field)
    }    >('field/fetchFieldById', async (fieldId, {fulfillWithValue, rejectWithValue, dispatch}) => {
    try
    {
        const result = await fetch(SERVER_ADDRESS + '/Map/'+fieldId, {mode: "cors", credentials: "include"});

        const newField = await result.json();
        
        fulfillWithValue(newField);
        return newField;
    }
    catch (e)
    {
        rejectWithValue("Couldn't load field from server");
    }
})

export const fieldSlice = createSlice({
    name: 'field',
    initialState,
    reducers: {
        setFieldId: (state, action : PayloadAction<number>) => {
            state.field.id = action.payload;
        },
        setField: (state, action : PayloadAction<Field>) => {
            state.field = action.payload;
        },
        changeCell: (state, action : PayloadAction<Coord>) => {
            const newSurvivors = state.field.survivors.filter(life => !(life.x === action.payload.x && life.y === action.payload.y));

            console.log('action.payload', action.payload)
            if (newSurvivors.length === state.field.survivors.length)
            {
                newSurvivors.push(action.payload);
            }
            state.field.survivors = newSurvivors;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchFieldById.fulfilled, (state, action) => {
            console.log("Request has been fulfilled", state);
            state.field = action.payload;
            console.log("Request has been fulfilled", state);
        });
        builder.addCase(fetchFieldById.rejected, (state, action) => {
            console.log("Request has been rejected");
        })        
        builder.addCase(fetchFieldById.pending, (state, action) => {
            console.log("Request is pending");
        })

        builder.addCase(createNewField.fulfilled, (state, action) => {
            state.field = action.payload!;
            console.log("Request of creating new field has been fulfilled");
        });
        builder.addCase(createNewField.rejected, (state, action) => {
            console.log("Request of creating new field has been rejected");
        })
        builder.addCase(createNewField.pending, (state, action) => {
            console.log("Request of creating new field is pending");
        })
    }
})

export const {setField, changeCell} = fieldSlice.actions;
export default fieldSlice.reducer;