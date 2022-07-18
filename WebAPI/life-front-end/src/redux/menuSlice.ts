import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SERVER_ADDRESS} from "../Utilities/serverAddress";
import {AppDispatch, RootState} from "./Store";
import {FieldInfo} from "../Types/FieldInfo";

export const fetchFieldsInfo = createAsyncThunk<
        void,
        void,
        {
            dispatch: AppDispatch,
            state: RootState
        }
    >('menu/fetchFieldsInfo',
    async (_, {rejectWithValue, dispatch}) => {
        try {
            const result = await fetch(SERVER_ADDRESS + '/Map/', {mode: "cors", credentials: "include", method: "GET"});
            const newMenu = await result.json();
            console.log("fetched menu -> ", newMenu)
            dispatch(setMenu(newMenu));
        } catch (e) {
            rejectWithValue(e);
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

interface FieldsInfo
{
    menu: FieldInfo[]
}

const initialState: FieldsInfo = {
    menu: []
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setMenu: (state, action: PayloadAction<FieldInfo[]>) => {
            state.menu = action.payload;
        },
        deleteItem: (state, action: PayloadAction<number>) => {
            const indToDelete = action.payload;
            state.menu = state.menu.filter((item, ind) => ind !== indToDelete);
        },
        renameItem: (state, action:PayloadAction<{ind: number, name: string}>) => {
            const ind = action.payload.ind;
            state.menu[ind].name = action.payload.name;
        }
    },
    extraReducers: builder => {

        builder.addCase(fetchFieldsInfo.pending, (state, action) => {

        });
        builder.addCase(fetchFieldsInfo.fulfilled, (state, action) => {

        });
        builder.addCase(fetchFieldsInfo.rejected, (state, action) => {

        });
    }
})

export const {setMenu, deleteItem, renameItem} = menuSlice.actions;
export default menuSlice.reducer; 