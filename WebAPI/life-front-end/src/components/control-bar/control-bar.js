import React from "react";
import "./control-bar.css";

export default function ControlBar(props) {
    
    let maps = props.Maps;

    console.log(maps);
    
    let component = (
        <form>
            <button onClick={MakeTurn} type={"button"}>Press me</button>
        </form>
    );

    let qwe = (
        <div className={"main-container"}>
            <div className={"control-map"}>
                <img src={""} alt={"map"}/>
                <div className={"vert-container"}>
                    <button className={"map-button"} type={"button"}>Save</button>
                    <button className={"map-button"} type={"button"}>Load</button>
                </div>
            </div>
        </div>
            
    );
    
    return qwe;
    
    function MakeTurn() {
        fetch('https://localhost:7129/Turn/1', {method: "POST"})
            .then( response => {
                    fetch('https://localhost:7129/Map')
                        .then(response => response.json())
                        .then(data => {
                            props.setSurvivors(data.data);
                        });
                }
            )
    }
}
