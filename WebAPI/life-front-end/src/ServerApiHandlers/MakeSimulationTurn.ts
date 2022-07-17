import {SERVER_ADDRESS} from "../Utilities/serverAddress";
import {SimulatedField} from "../Types/SimulatedField";


export async function MakeSimulationTurn(simulatedFieldId: string) : Promise<SimulatedField>
{
    try {

        const response = await fetch(SERVER_ADDRESS + '/Turn/', 
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
        return {id:"", survivors:[]};
    }
}