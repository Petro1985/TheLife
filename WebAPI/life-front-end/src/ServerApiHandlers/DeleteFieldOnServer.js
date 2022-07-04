import {SERVER_ADDRESS} from "../Utilities/serverAddress";

export async function DeleteFieldOnServer(fieldId)
{
    try {
        const fetchOptions = {mode: "cors", credentials: "include", method: "DELETE"};

        await fetch(SERVER_ADDRESS + '/Map/'+fieldId, fetchOptions)
    }
    catch (e)
    {
        console.error("func DeleteFieldOnServer error:" + e);
    }
}