import {SERVER_ADDRESS} from "../Utilities/serverAddress";


export async function MakeSimulationTurn(simulationFieldId)
{
    try {
        const fetchOptions = {
            mode: "cors",
            credentials: "include",
            method: "POST"
        };

        const response = await fetch(SERVER_ADDRESS + '/Turn/' + simulationFieldId, fetchOptions);

        return await response.json();
    }
    catch (e)
    {
        console.error("func setFieldSimulation error: ", e);
    }
}