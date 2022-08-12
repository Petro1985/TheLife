import React from "react";
import {
    EDIT_MODE,
    setIntervalId,
    setSimulationMode,
    SIMULATION_MODE,
    SIMULATION_PAUSE_MODE
} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {SimulationHubConnectionService} from "../../../Services/WebSocketConnectionService";
import {pauseSimulationHandler} from "../ControlBarHandlers/pauseSimulationHandler";

export const PauseButton: React.FC = () =>
{
    const currentMode = useAppSelector(state => state.playGround.mode);

    return (
        <button
            onClick={pauseSimulationHandler}
            disabled={currentMode !== SIMULATION_MODE && currentMode !== SIMULATION_PAUSE_MODE}
            className={"control--button-pause green-button"}
            type={"button"}>
            {currentMode === SIMULATION_PAUSE_MODE ?"Play" : "Pause"}
        </button>
    );
}