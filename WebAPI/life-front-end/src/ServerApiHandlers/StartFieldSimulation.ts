import {SERVER_ADDRESS} from "../Utilities/serverAddress";
import {SimulatedField} from "../Types/SimulatedField";


export async function StartNewFieldSimulation(fieldId: number) : Promise<SimulatedField>
{
    try {
        const response = await fetch(SERVER_ADDRESS + '/StartNewFieldSimulation/' + fieldId, 
            {
            mode: "cors",
            credentials: "include",
            method: "POST"
            });

        return await response.json();        
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
        return {id:"", survivors:[]};
    }
}