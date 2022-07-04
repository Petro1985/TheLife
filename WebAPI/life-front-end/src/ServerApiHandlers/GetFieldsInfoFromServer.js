export async function GetAllMapsInfoFromServer()
{
    try {
        const fetchOptions = {mode: "cors", credentials: "include", method: "GET"};

        const result = await fetch('https://localhost:7129/Map/', fetchOptions);
        return result.json();
    }
    catch (e)
    {
        console.error("func FetchService.GetAllMapsInfo error: " + e);
    }
}