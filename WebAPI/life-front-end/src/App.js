import Field from "./components/field/field";
import './App.css';
import React, {useEffect, useState} from 'react';
import ControlBar from "./components/control-bar/control-bar";
import Menu from "./components/menu/menu"
import {logDOM} from "@testing-library/react";
import {FetchService} from "./Services/FetchService";
import {MapService} from "./Services/MapService";

class EmulationService
{
    #fetchService;
    mapService
    #intervalID
    #MapName
    #MapId

    constructor(fetchService)
    {
        this.fetchService = fetchService;
    }

    async #Emulation(id) {
        const newMap = await fetchService.MakeTurn();
        newMap.id = id;
        this.mapService.SetNewMap(newMap)
        this.mapService.ApplyCurrentMap()
    }

    async StartEmulation() {
        this.#MapId = this.mapService.currentMap.id;
        this.#MapName = this.mapService.currentMap.name;

        console.log("saved name/id = "+this.#MapName+"/"+this.#MapId);
        const result = await this.fetchService.SetCurrentMapAsActive(this.#MapId);
        if (!result) return false;
        this.#intervalID  = window.setInterval(() => this.#Emulation(this.#MapId), 1000)        
    }

    PauseEmulation()
    {
        console.log("Emulation paused")
        window.clearInterval(this.#intervalID);        
    }
    
    async StopEmulation() {
        this.PauseEmulation()
        const mapId = this.mapService.currentMap.id;
        console.log("MapId when stopped: "+mapId)
        const map = await this.fetchService.GetMap(mapId);
        map.id = this.#MapId;
        map.name = this.#MapName;
        mapService.SetNewMap(map);
        mapService.ApplyCurrentMap();
        console.log(map)
    }
}

const AppStates = {
    Menu: 1,
    SettingField: 2,
    Playing: 3
};
Object.freeze(AppStates);

const mapService = new MapService();
const fetchService = new FetchService();
fetchService.GetUserInfo()
    .then();
const emulationService = new EmulationService(fetchService);



function App() {
    const [AppState, setAppState] = useState(AppStates.Menu);
    const [CurrentMap, setCurrentMap] = useState({"id":-1, "survivors": [], "name":""});

    mapService.setMap = setCurrentMap;
    mapService.currentMap = CurrentMap;
    emulationService.mapService = mapService;

    window.onkeyup = function(ev)     // is it correct way to do this?
    {
        if (ev.key === 'Escape') 
        {
            console.log("Esc pressed");
            setAppState(1);
        }
    }

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
                emulationService = {emulationService}
            />
            {MainPart}
        </div>
    );
}

export default App;
