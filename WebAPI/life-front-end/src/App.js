import Field from "./components/field/field";
import './App.css';
import React, {useEffect, useState} from 'react';
import ControlBar from "./components/control-bar/control-bar";
import Menu from "./components/menu/menu"
import {logDOM} from "@testing-library/react";
//import FetchService from "./FetchService";

class MapService
{
    currentMap;
    setMap;

    constructor(setMapFunc, map)
    {
        this.setMap = setMapFunc;
        this.currentMap = map; 
    }

    SetNewMap(map)
    {
        // console.log("--------new map before set---------");
        // console.log(this.currentMap);
        this.setMap(map);
        // console.log("--------new map set---------");
        // console.log(map);
    }

    ChangeLife(x, y)
    {
        const newMap = {};
        //newMap.id = this.currentMap.id;
        newMap.name = this.currentMap.name;

        newMap.survivors = this.currentMap.survivors.filter(life => !(life.x === x && life.y === y));
    
        if (newMap.survivors.length === this.currentMap.survivors.length)
        {
            newMap.survivors.push({x:x, y:y});
        }
        return newMap;
    }
}


class FetchService
{
    fetchOptions = {mode: "cors", credentials: "include"};
    
    async GetMap(id)
    {
        try {
            const result = await fetch('https://localhost:7129/Map/'+id, this.fetchOptions);
            const map = await result.json();
            // console.log("------Map Loaded-------");
            // console.log(map);
            return map;
        }
        catch (e)
        {
            console.error("func GetMap error: " + e);
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
                console.log("got new id=" + currentMapId);
            }
            else
            {
                const result = await fetch('https://localhost:7129/Map/' + map.id, 
                    {...this.fetchOptions, method: "PUT", body: bodyContent, headers: headersContent});

                
            }

            return currentMapId;
        }
        catch (e)
        {
            console.error("func SetMap error: " + e);
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
            console.error("func SetMap error: " + e);
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
        }
        catch (e)
        {
            console.error("func GetUserInfo error:" + e);
        }
    }
}
const AppStates = {
    Menu: 1,
    SettingField: 2,
    Playing: 3
};

Object.freeze(AppStates);


function App() {
    //const [survivors, setSurvivors] = useState({survivors:[]});
    const [AppState, setAppState] = useState(AppStates.Menu);
    const [CurrentMap, setCurrentMap] = useState({"id":-1, "survivors": [], "name":""});

    const mapService = new MapService(setCurrentMap, CurrentMap);
    
    const fetchService = new FetchService();
    fetchService.GetUserInfo()
        .then();
    
    
    // useEffect(() => {
    //         async function fetchData() {
    //             const map = await fetchService.GetMap(3);
    //             // console.log(map);
    //             setSurvivors(map);
    //         }
    //         fetchData();
    //     }, []
    // )

    const MainPart = (AppState === AppStates.Menu) ?
            <Menu 
                AppStateSetter = {setAppState}
                fetchService = {fetchService}
                mapService = {mapService}
            />
        :
            (
            <Field
                mapService = {mapService}
                fetchService = {fetchService}
            />
            );
    

    return (
        <div className="flex-container">
            <ControlBar
                map = {CurrentMap}
                mapService = {mapService}
            />
            {MainPart}
        </div>
    );
}



export default App;
