
export async function createNewFieldOnServer()
{
    try {
        const baseFetchOptions = {mode: "cors", credentials: "include", headers: {'Content-Type': 'application/json'}};
        const bodyContent =  JSON.stringify({"survivors": [], "name": ""});
        
        const result = await fetch('https://localhost:7129/Map/',
            {...baseFetchOptions, method: "POST", body: bodyContent}
        );

        return await result.json();
    }
    catch (e)
    {
        console.error("func FetchService.SetMap error: " + e);
    }

}
