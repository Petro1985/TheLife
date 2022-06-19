import Field from "./components/field/field";
import './App.css';
import React, {useEffect, useState} from 'react';
import ControlBar from "./components/control-bar/control-bar";


class FetchService
{
    fetchOptions = {mode: "cors", credentials: "include"};    
    
    async GetMap(id)
    {
        try {
            const result = await fetch('https://localhost:7129/Map/'+id, this.fetchOptions);
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

    const fetchService = new FetchService();   
    
    useEffect(() => {
            return async () => {
                const map = await fetchService.GetMap(3);
                // console.log(map);
                setSurvivors(map);
            };
        }, []
    )
    
    return (
        <div className="flex-container">
            <ControlBar
                setResult = {setSurvivors}
                Maps = {survivors ? survivors : []}
            />
            <Field 
                Survivors = {survivors}
                setField = {setSurvivors}
          />
        </div>
    );
}



export default App;
