import {SERVER_ADDRESS} from "../Utilities/serverAddress";

export async function StopFieldSimulation(simulatedFieldId)
{
    try {
        const fetchOptions = {
            mode: "cors",
            credentials: "include",
            method: "DELETE"
        };

        await fetch(SERVER_ADDRESS + '/StopFieldSimulation/' + simulatedFieldId, fetchOptions);

        console.log(`simulation with ID=${simulatedFieldId} deleted`);
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
    }
}