import React from "react";
import "./control-bar.css";

export default function ControlBar(props) {

    const emulationService = props.emulationService;

    async function onPlayClick() {
        await emulationService.StartEmulation();
    }
    async function onPauseClick() {
        await emulationService.PauseEmulation();
    }
    async function onStopClick() {
        await emulationService.StopEmulation();
    }

    return (
        <div className={"main-container"}>
            <button onClick={onPlayClick} className={"control--button-play green-button"} type={"button"}>Play</button>
            <button onClick={onPauseClick} className={"control--button-pause green-button"} type={"button"}>Pause</button>
            <button onClick={onStopClick} className={"control--button-stop green-button"} type={"button"}>Stop</button>
        </div>
    );
}
