import {SERVER_ADDRESS} from "../Utilities/serverAddress";


export async function MakeSimulationTurn(simulatedFieldId)
{
    try {
        const fetchOptions = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(simulatedFieldId),
        };

        const response = await fetch(SERVER_ADDRESS + '/Turn/', fetchOptions);

        return await response.json();
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
    }
}