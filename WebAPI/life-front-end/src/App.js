import Field from "./components/field/field";
import './App.css';
import React, {useEffect, useState} from 'react';
import ControlBar from "./components/control-bar/control-bar";


function App() {
    const [survivors, setSurvivors] = useState(null);

    useEffect(() => {
            fetch('https://localhost:7129/Map')
                .then(response => response.json())
                .then(data => {
                    setSurvivors(data.survivors);
                })
                .catch(e => console.log(e));
        } , []
    )
    
    return (
        <div className="flex-container">
            <ControlBar
                setResult={setSurvivors} />
            <Field 
                Survivors={survivors ? survivors : []}
          />
        </div>
    );
}



export default App;
