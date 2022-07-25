import {SERVER_ADDRESS} from "../../Utilities/serverAddress";
import {PatternInfo} from "../../Types/PatternInfo";

export async function GetAllPatternsInfoFromServer() : Promise<PatternInfo[]>
{
    try {
        const result = await fetch(SERVER_ADDRESS + '/Pattern/', {mode: "cors", credentials: "include", method: "GET"});
        return await result.json();
    }
    catch (e)
    {
        console.error("func FetchService.GetAllMapsInfo error: " + e);
        return [{id:-1, lastChange:"", name:"", previewBase64:"", description: ""}];
    }
}