export async function DeleteFieldOnServer(fieldId)
{
    try {
        const fetchOptions = {mode: "cors", credentials: "include", method: "DELETE"};

        await fetch('https://localhost:7129/Map/'+fieldId, fetchOptions)
    }
    catch (e)
    {
        console.error("func DeleteFieldOnServer error:" + e);
    }
}