
export async function createNewFieldOnServer() : Promise<number>
{
    try {
        const bodyContent =  JSON.stringify({"survivors": [], "name": ""});
        
        const result = await fetch('https://localhost:7129/Map/',
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
