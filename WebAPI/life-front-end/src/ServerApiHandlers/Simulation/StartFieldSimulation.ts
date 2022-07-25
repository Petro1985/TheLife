import {SERVER_ADDRESS} from "../../Utilities/serverAddress";
import {SimulationFieldResponse} from "../../Types/SimulationFieldResponse";


export async function StartNewFieldSimulationServerAPI(fieldId: number) : Promise<SimulationFieldResponse>
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
        return {id:"", field: [{survivors:[]}]};
    }
}