﻿import {SERVER_ADDRESS} from "../Utilities/serverAddress";


export async function StartNewFieldSimulation(fieldId)
{
    try {
        const fetchOptions = {
            mode: "cors",
            credentials: "include",
            method: "POST"
        };
        
        const response = await fetch(SERVER_ADDRESS + '/StartNewFieldSimulation/' + fieldId, fetchOptions);

        return await response.json();        
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
    }
}