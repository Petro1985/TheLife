import {SERVER_ADDRESS} from "../Utilities/serverAddress";

export async function GetAllMapsInfoFromServer()
{
    try {
        const fetchOptions = {mode: "cors", credentials: "include", method: "GET"};

        const result = await fetch(SERVER_ADDRESS + '/Map/', fetchOptions);
        return result.json();
    }
    catch (e)
    {
        console.error("func FetchService.GetAllMapsInfo error: " + e);
    }
}