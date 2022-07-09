
export async function createNewFieldOnServer()
{
    try {
        const bodyContent =  JSON.stringify({"survivors": [], "name": ""});

        const fetchOptions = {
            mode: "cors", 
            credentials: "include", 
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: bodyContent,
        };
        
        const result = await fetch('https://localhost:7129/Map/',
            fetchOptions
        );
        
        return await result.json();
    }
    catch (e)
    {
        console.error("func createNewFieldOnServer error: ", e);
    }
}
