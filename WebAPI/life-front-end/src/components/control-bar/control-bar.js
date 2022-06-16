import React from "react";

export default function ControlBar(props) {
    return (
        <form>
            <button onClick={MakeTurn} type={"button"}>Press me</button>
        </form>
    );

    function MakeTurn() {
        fetch('https://localhost:7129/Turn/1', {method: "POST"})
            .then( response => {
                    fetch('https://localhost:7129/Map')
                        .then(response => response.json())
                        .then(data => {
                            props.setSurvivors(data.survivors);
                        });
                }
            )
    }
}
