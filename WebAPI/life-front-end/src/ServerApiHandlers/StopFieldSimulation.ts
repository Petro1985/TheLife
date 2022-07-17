import {SERVER_ADDRESS} from "../Utilities/serverAddress";

export async function StopFieldSimulation(simulatedFieldId: string) : Promise<void>
{
    try {
        await fetch(SERVER_ADDRESS + '/StopFieldSimulation/',
            {
                mode: "cors",
                credentials: "include",
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(simulatedFieldId),
            });
        
        console.log(`simulation with ID=${simulatedFieldId} deleted`);
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
    }
}