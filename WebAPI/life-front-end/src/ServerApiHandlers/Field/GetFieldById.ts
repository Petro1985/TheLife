import {SERVER_ADDRESS} from "../../Utilities/serverAddress";


export const getFieldById = async (fieldId: number) => 
{
    const result = await fetch(SERVER_ADDRESS + '/Map/' + fieldId, {mode: "cors", credentials: "include"});
    return await result.json();
}