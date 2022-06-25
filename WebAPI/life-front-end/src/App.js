import Field from "./components/field/field";
import './App.css';
import React, {useEffect, useState} from 'react';
import ControlBar from "./components/control-bar/control-bar";
import Menu from "./components/menu/menu"

const AppStates = {
    Menu: 1,
    SettingField: 2,
    Playing: 3
};

Object.freeze(AppStates);

class FetchService
{
    fetchOptions = {mode: "cors", credentials: "include"};    
    
    async GetMap(id, setMapId)
    {
        try {
            const result = await fetch('https://localhost:7129/Map/'+id, this.fetchOptions);
            const map = await result.json();
            // console.log("------Map Loaded-------");
            // console.log(map);
            setMapId(map.id);
            return map;
        }
        catch (e)
        {
            console.error("func GetMap error: " + e);
        }
    }
    
    async SetMap(id)
    {
        
        try {
            const result = await fetch('https://localhost:7129/Map/'+id, {...this.fetchOptions, method: "PUT"});
            const map = await result.json();
            return map;
        }
        catch (e)
        {
            console.error("func GetMap error: " + e);
        }
    }
    
}

function App() {
    const [survivors, setSurvivors] = useState({survivors:[]});
    const [AppState, setAppState] = useState(AppStates.Menu);
    const [CurrentMapId, setCurrentMapId] = useState(-1);

    
    const fetchService = new FetchService();   
    
    useEffect(() => {
            async function fetchData() {
                const map = await fetchService.GetMap(3, setCurrentMapId);
                // console.log(map);
                setSurvivors(map);
            }
            fetchData();
        }, []
    )

    const MainPart = (AppState === AppStates.Menu) ?
            <Menu 
                AppStateSetter = {setAppState}
            />
        :
            (
            <Field
                Survivors = {survivors}
                setField = {setSurvivors}
            />
            );
    

    return (
        <div className="flex-container">
            <ControlBar
                setResult = {setSurvivors}
                Maps = {survivors ? survivors : []}
            />
            {MainPart}
        </div>
    );
}



export default App;
