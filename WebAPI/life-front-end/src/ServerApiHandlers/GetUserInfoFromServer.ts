import {SERVER_ADDRESS} from "../Utilities/serverAddress";


export async function GetUserInfoFromServer()
{
    try {
        let data = await fetch(SERVER_ADDRESS + '/WhoAmI', {mode: "cors", credentials: "include", method: "GET"})
        if (data.status === 401) {
            data = await fetch(SERVER_ADDRESS + '/Registration', {mode: "cors", credentials: "include", method: "POST"})
        }
        const userClaims = await data.json();
        console.log("User logged in id=" + userClaims[0].value);
    }
    catch (e)
    {
        console.error("func FetchService.GetUserInfo error:" + e);
    }
}