import {SERVER_ADDRESS} from "../../Utilities/serverAddress";

export async function createNewFieldOnServer() : Promise<number>
{
    try {
        const bodyContent =  JSON.stringify({"survivors": [], "name": ""});
        
        const result = await fetch(SERVER_ADDRESS + '/Map/',
            {
                mode: "cors",
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: bodyContent,
            }
        );
        
        return await result.json();
    }
    catch (e)
    {
        console.error("func createNewFieldOnServer error: ", e);
        throw e;
    }
}
