import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SERVER_ADDRESS} from "../Utilities/serverAddress";
import {AppDispatch, RootState} from "./Store";
import {FieldInfo} from "../Types/FieldInfo";
import {GetAllMapsInfoFromServer} from "../ServerApiHandlers/Menu/GetFieldsInfoFromServer";
import {GetAllPatternsInfoFromServer} from "../ServerApiHandlers/Menu/GetPatternsInfoFromServer";
import {PatternInfo} from "../Types/PatternInfo";

export const fetchFieldsInfo = createAsyncThunk<
        FieldInfo[],
        void,
        {
            dispatch: AppDispatch,
            state: RootState
        }
    >('menu/fetchFieldsInfo',
    async (_, {rejectWithValue}) => {
        try {
            const newMenu = await GetAllMapsInfoFromServer();
            console.log("fetched menu -> ", newMenu)
            return newMenu;
        } catch (e) {
            rejectWithValue(e);
            return [];
        }
    });

export const fetchPatternsInfo = createAsyncThunk<
    PatternInfo[],
    void,
    {
        dispatch: AppDispatch,
        state: RootState
    }
    >('menu/fetchPatternsInfo',
    async (_, {rejectWithValue}) => {
        try {
            const patterns = await GetAllPatternsInfoFromServer();
            console.log("fetched menu -> ", patterns)
            return patterns;
        } catch (e) {
            rejectWithValue(e);
            return [];
        }
    });


export const renameField = createAsyncThunk<
    void,
    {fieldId: number, ind: number, newName: string},
    {
        dispatch: AppDispatch,
        state: RootState
    }
    >('menu/renameField', 
    async (newField, {rejectWithValue, dispatch}) => {
    try {
        await fetch(SERVER_ADDRESS + '/UpdateFieldName/'+newField.fieldId+'?newName='+newField.newName, 
            {mode: "cors", credentials: "include", method: "PUT"});
        
        dispatch(renameItem({ind:newField.ind, name:newField.newName}));
    } catch (e) {
        console.log("Something went wrong")
        rejectWithValue(e);
    }
});

interface MenuInfo
{
    fields: FieldInfo[]
    patterns: PatternInfo[]
}

const initialState: MenuInfo = {
    fields: [],
    patterns: []
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {

        deleteItem: (state, action: PayloadAction<number>) => {
            const indToDelete = action.payload;
            state.fields = state.fields.filter((item, ind) => ind !== indToDelete);
        },
        renameItem: (state, action:PayloadAction<{ind: number, name: string}>) => {
            const ind = action.payload.ind;
            state.fields[ind].name = action.payload.name;
        }
    },
    extraReducers: builder => {

        builder.addCase(fetchFieldsInfo.pending, (state, action) => {

        });
        builder.addCase(fetchFieldsInfo.fulfilled, (state, action) => 
        {
            state.fields = action.payload;
        });
        builder.addCase(fetchFieldsInfo.rejected, (state, action) => {

        });


        builder.addCase(fetchPatternsInfo.pending, (state, action) => {

        });
        builder.addCase(fetchPatternsInfo.fulfilled, (state, action) =>
        {
            state.patterns = action.payload;
        });
        builder.addCase(fetchPatternsInfo.rejected, (state, action) => {

        });
    }
})

export const {deleteItem, renameItem} = menuSlice.actions;
export default menuSlice.reducer; 