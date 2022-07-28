import {SERVER_ADDRESS} from "../../Utilities/serverAddress";
import {SimulationFieldResponse} from "../../Types/SimulationFieldResponse";
import {Coord} from "../../Types/Coord";


export async function startNewFieldSimulationServerAPI(survivors: Coord[]) : Promise<SimulationFieldResponse>
{
    try {
        const bodyContent = JSON.stringify(survivors);
        console.log(bodyContent);
        const response = await fetch(SERVER_ADDRESS + '/StartNewFieldSimulation/', 
            {
                mode: "cors",
                credentials: "include",
                method: "POST", 
                body: bodyContent,
                headers: {'Content-Type': 'application/json'},
            });

        return await response.json();        
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
        return {id:"", field: [{survivors:[]}]};
    }
}