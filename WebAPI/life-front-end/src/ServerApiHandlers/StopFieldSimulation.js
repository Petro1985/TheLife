import {SERVER_ADDRESS} from "../Utilities/serverAddress";

export async function StopFieldSimulation(simulatedFieldId)
{
    try {
        const fetchOptions = {
            mode: "cors",
            credentials: "include",
            method: "DELETE",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(simulatedFieldId),
        };
        
        await fetch(SERVER_ADDRESS + '/StopFieldSimulation/', fetchOptions);

        console.log(`simulation with ID=${simulatedFieldId} deleted`);
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
    }
}