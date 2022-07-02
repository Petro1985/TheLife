

export async function GetUserInfoFromServer()
{
    try {
        const baseFetchOptions = {mode: "cors", credentials: "include", method: "GET"};

        let data = await fetch('https://localhost:7129/WhoAmI', baseFetchOptions)
        if (data.status === 401) {
            data = await fetch('https://localhost:7129/Registration', {...baseFetchOptions, method: "POST"})
        }
        const userClaims = await data.json();
        console.log("User logged in id=" + userClaims[0].value);
    }
    catch (e)
    {
        console.error("func FetchService.GetUserInfo error:" + e);
    }
}