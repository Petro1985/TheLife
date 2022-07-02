import {
    CHANGE_CELL,
    GET_FIELD_FROM_SERVER,
    SET_FIELD_ID,
    SET_FIELD,
} from "./types";

export function changeField(coord) {
    return {
        type: CHANGE_CELL,
        coord
    };
}

export function getFieldFromServer(id, fieldName)
{
    return async dispatch =>
    {
        try 
        {
            const baseFetchOptions = {mode: "cors", credentials: "include"};
            const result = await fetch('https://localhost:7129/Map/'+id, baseFetchOptions);
            
            const newField = await result.json();
            newField.name = fieldName;
            console.log("fetched map > ", newField);
            
            dispatch({
                type: GET_FIELD_FROM_SERVER,
                data: newField,
            })
        }
        catch (e)
        {
            console.error("func FetchService.GetMap error: " + e);
        }
    }
}

export function setFieldId(id) {
    return {
        type: SET_FIELD_ID,
        newId: id
    };
}

export function setField(field)
{
    return {
        type: SET_FIELD,
        data: field
    };    
}

// there are "action creators"