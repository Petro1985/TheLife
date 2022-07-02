export async function DeleteFieldOnServer(fieldId)
{
    try {
        const baseFetchOptions = {mode: "cors", credentials: "include", method: "DELETE"};

        await fetch('https://localhost:7129/Map/'+fieldId, baseFetchOptions)
    }
    catch (e)
    {
        console.error("func DeleteFieldOnServer error:" + e);
    }
}