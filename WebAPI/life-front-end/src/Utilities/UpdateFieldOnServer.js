export default async function updateFieldOnServer(field)
{
    let fieldId = field.id;
    try {
        const baseFetchOptions = {mode: "cors", credentials: "include", headers: {'Content-Type': 'application/json'}};
        const bodyContent =  JSON.stringify({"survivors": field.survivors, "name": field.name});

        await fetch('https://localhost:7129/Map/' + field.id,
            {...baseFetchOptions, method: "PUT", body: bodyContent});

    }
    catch (e)
    {
        console.error("func FetchService.SetMap error: " + e);
    }
}



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
