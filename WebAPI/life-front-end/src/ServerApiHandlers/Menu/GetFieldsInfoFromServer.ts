import {SERVER_ADDRESS} from "../../Utilities/serverAddress";
import {FieldInfo} from "../../Types/FieldInfo";

export async function GetAllMapsInfoFromServer() : Promise<FieldInfo[]>
{
    try {
        const result = await fetch(SERVER_ADDRESS + '/Map/', {mode: "cors", credentials: "include", method: "GET"});
        return result.json();
    }
    catch (e)
    {
        console.error("func FetchService.GetAllMapsInfo error: " + e);
        return [{id:-1, lastChange:"", name:"",minimapBase64:""}];
    }
}