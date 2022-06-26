
export class FetchService
{
    fetchOptions = {mode: "cors", credentials: "include"};

    async GetMap(id)
    {
        try {
            // console.log("------Map Loaded-------");
            // console.log(id);
            const result = await fetch('https://localhost:7129/Map/'+id, this.fetchOptions);
            const map = await result.json();
            // console.log("------Map Loaded-------");
            // console.log(map);
            return map;
        }
        catch (e)
        {
            console.error("func FetchService.GetMap error: " + e);
        }
    }

    async SetMap(map)
    {
        // console.log("-----map to post --------");
        // console.log(map);
        let currentMapId = map.id;
        try {

            const bodyContent =  JSON.stringify({"survivors": map.survivors, "name": map.name});
            const headersContent = {'Content-Type': 'application/json'};

            if (map.id === -1)
            {
                const result = await fetch('https://localhost:7129/Map/',
                    {...this.fetchOptions, method: "POST", body: bodyContent, headers: headersContent}
                );

                currentMapId = await result.json();
                // console.log("got new id=" + currentMapId);
            }
            else
            {
                console.log("Put id=" + map.id);
                console.log(bodyContent);
                const result = await fetch('https://localhost:7129/Map/' + map.id,
                    {...this.fetchOptions, method: "PUT", body: bodyContent, headers: headersContent});
            }

            return currentMapId;
        }
        catch (e)
        {
            console.error("func FetchService.SetMap error: " + e);
        }
    }

    async GetAllMapsInfo()
    {
        try {
            const result = await fetch('https://localhost:7129/Map/', {...this.fetchOptions, method: "GET"});
            // console.log("------------MapsInfo-Result------------");
            // console.log(result);
            return result.json();
        }
        catch (e)
        {
            console.error("func FetchService.GetAllMapsInfo error: " + e);
        }
    }

    async GetUserInfo()
    {
        try {
            let data = await fetch('https://localhost:7129/WhoAmI', {mode: "cors", credentials: "include"})
            if (data.status === 401) {
                data = await fetch('https://localhost:7129/Registration', {
                    mode: "cors",
                    method: "POST",
                    credentials: "include"
                })
            }
            const userClaims = await data.json();
            console.log("User logged in id=" + userClaims[0].value);
        }
        catch (e)
        {
            console.error("func FetchService.GetUserInfo error:" + e);
        }
    }

    async SetCurrentMapAsActive(id) {
        try {
            await fetch('https://localhost:7129/SetFieldForSimulation/' + id,
                {...this.fetchOptions, method: "POST"});
            return true;
        } catch (e) {
            console.error("func FetchService.SetCurrentMapAsActive error: " + e);
            return false;
        }
    }


    async MakeTurn() {
        try {
            const result = await fetch('https://localhost:7129/Turn/',
                {...this.fetchOptions, method: "POST"});
            
            const newMap = await result.json();
            // console.log(newMap);
            return newMap;
        } catch (e) {
            console.error("Func FetchService.MakeTurn error: " + e);
        }
    }
}