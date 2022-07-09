import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SERVER_ADDRESS} from "../Utilities/serverAddress";
import {createNewFieldOnServer} from "../ServerApiHandlers/UpdateFieldOnServer";

const initialField = {
    field: {
        survivors: [],
        id: -1,
        name: "",
    },
}

export const createNewField = createAsyncThunk('field/createNewField', async (_,{fulfillWithValue, rejectWithValue, dispatch}) => {
    try {
        const newField = {"survivors": [], "name": ""};
        newField.id = await createNewFieldOnServer()

        dispatch(setField(newField));
        return newField;
    }
    catch (e)
    {
        rejectWithValue(e);
    }
})

export const updateFieldOnServer = createAsyncThunk('field/updateFieldOnServer', async (_, {getState, rejectedWithValue, dispatch}) => {
    try {
        const field = getState().field.field;
        const baseFetchOptions = {mode: "cors", credentials: "include", headers: {'Content-Type': 'application/json'}};
        const bodyContent =  JSON.stringify({"survivors": field.survivors, "name": field.name});

        await fetch(SERVER_ADDRESS + '/Map/' + field.id,
            {...baseFetchOptions, method: "PUT", body: bodyContent});
    }
    catch (e)
    {
        rejectedWithValue("error during updating field: " + e);
    }
})

export const fetchFieldById = createAsyncThunk('field/fetchFieldById', async (fieldId, {rejectedWithValue, dispatch}) => {
    try 
    {
        const baseFetchOptions = {mode: "cors", credentials: "include"};
        const result = await fetch(SERVER_ADDRESS + '/Map/'+fieldId, baseFetchOptions);

        const newField = await result.json();
        dispatch(setField(newField));
    }
    catch (e)
    {
        rejectedWithValue("Couldn't load field from server");
    }
})

export const fieldSlice = createSlice({
    name: 'field',
    initialState: initialField,
    reducers: {
        setFieldId: (state, action) => {
            state.field.id = action.payload;
            console.log("setFieldID -> ", state.field)
        },
        setField: (state, action) => {
            state.field = action.payload;
            console.log("setField ->", state.field)
        },
        changeCell: (state, action) => {
            const x = action.payload.x;
            const y = action.payload.y;
            const newSurvivors = state.field.survivors.filter(life => !(life.x === x && life.y === y));

            if (newSurvivors.length === state.field.survivors.length)
            {
                newSurvivors.push({x:x, y:y});
            }
            state.field.survivors = newSurvivors;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchFieldById.fulfilled, (state, action) => {
            console.log("Request has been fulfilled");
        });
        builder.addCase(fetchFieldById.rejected, (state, action) => {
            console.log("Request has been rejected");
        })        
        builder.addCase(fetchFieldById.pending, (state, action) => {
            console.log("Request is pending");
        })

        builder.addCase(createNewField.fulfilled, (state, action) => {
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

export const {setField, setFieldId, changeCell} = fieldSlice.actions;
export default fieldSlice.reducer;