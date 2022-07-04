import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SERVER_ADDRESS} from "../Utilities/serverAddress";


export const fetchFieldsInfo = createAsyncThunk('menu/fetchFieldsInfo', async (_, {rejectWithValue, dispatch}) => {
    try {
        const fetchOptions = {mode: "cors", credentials: "include", method: "GET"};
        const result = await fetch(SERVER_ADDRESS + '/Map/', fetchOptions);
        const newMenu = await result.json();
        console.log("fetched menu -> ",newMenu)
        dispatch(setMenu(newMenu));
    } catch (e) {
        rejectWithValue(e);
    }
})

export const renameField = createAsyncThunk('menu/renameField', 
    async ({fieldId, ind, newName}, {rejectWithValue, dispatch}) => {
    try {
        const fetchOptions = {mode: "cors", credentials: "include", method: "PUT"};
        await fetch(SERVER_ADDRESS + '/UpdateFieldName/'+fieldId+'?newName='+newName, fetchOptions);
        dispatch(renameItem({ind:ind, newName:newName}));
    } catch (e) {
        console.log("Something went wrong")
        rejectWithValue(e);
    }
});

export const menuSlice = createSlice({
    name: 'menu',
    initialState: {menu:[]},
    reducers: {
        setMenu: (state, action) => {
            console.log("state before",state);
            state.menu = action.payload;
            console.log("state after",state);
        },
        deleteItem: (state, action) => {
            const indToDelete = action.payload;
            state.menu = state.menu.filter((item, ind) => ind !== indToDelete);
        },
        renameItem: (state, action) => {
            const ind = action.payload.ind;
            state.menu[ind].name = action.payload.newName;
        }
    },
    extraReducers: {
        [fetchFieldsInfo.fulfilled]: () => {
            
        },
        [fetchFieldsInfo.pending]: () => {
            
        },
        [fetchFieldsInfo.rejected]: () => {
            
        }
    }
})

export const {setMenu, deleteItem, renameItem} = menuSlice.actions;
export default menuSlice.reducer; 