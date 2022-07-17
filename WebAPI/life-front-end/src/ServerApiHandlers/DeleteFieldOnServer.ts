import {SERVER_ADDRESS} from "../Utilities/serverAddress";


export async function DeleteFieldOnServer(fieldId: number)
{
    try {
        await fetch(SERVER_ADDRESS + '/Map/'+fieldId, {mode: "cors", credentials: "include", method: "DELETE"})
    }
    catch (e)
    {
        console.error("func DeleteFieldOnServer error:" + e);
    }
}