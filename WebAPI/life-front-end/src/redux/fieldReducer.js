import { MapService } from "../Services/MapService";
import { FetchService } from "../Services/FetchService";
import {CHANGE_CELL, GET_FIELD_FROM_SERVER, SET_FIELD, SET_FIELD_ID, UPDATE_FIELD_ON_SERVER} from "./types";

const initialField = {
    field: {
        survivors: [],
        id: -1,
        name: "",
    },
}

export const fieldReducer = (state =  initialField, action) => {
    console.log("State -> ", state);
    console.log("fieldReducer -> ", action);
    
    let newState;
    switch (action.type)
    {
        case CHANGE_CELL:
            newState = {...state};
            const x = action.coord.x;
            const y = action.coord.y;
            const newSurvivors = state.field.survivors.filter(life => !(life.x === x && life.y === y));

            if (newSurvivors.length === state.field.survivors.length)
            {
                newSurvivors.push({x:x, y:y});
            }
            newState.field.survivors = newSurvivors;
            return newState;
        case SET_FIELD:
        case GET_FIELD_FROM_SERVER:
            newState = {...state, "field": action.data};
            return newState;
        default: return state;
    }
}
