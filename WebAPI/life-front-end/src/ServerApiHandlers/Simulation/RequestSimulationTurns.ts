import {SERVER_ADDRESS} from "../../Utilities/serverAddress";
import {SimulationFieldResponse} from "../../Types/SimulationFieldResponse";


export async function RequestSimulationTurns(simulatedFieldId: string, count: number) : Promise<SimulationFieldResponse>
{
    try {

        const response = await fetch(SERVER_ADDRESS + '/Turn/' + count, 
            {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(simulatedFieldId),
        });

        return await response.json();
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
        return {id:"", field:[]};
    }
}