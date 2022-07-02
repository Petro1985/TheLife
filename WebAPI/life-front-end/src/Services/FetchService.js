
export class FetchService
{
    fetchOptions = {mode: "cors", credentials: "include"};

    async GetMap(id)
    {
        try {
            const result = await fetch('https://localhost:7129/Map/'+id, this.fetchOptions);
            return await result.json();
        }
        catch (e)
        {
            console.error("func FetchService.GetMap error: " + e);
        }
    }

    async SetMap(map)
    {
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


}