import React from "react";
import {
    SIMULATION_MODE,
    SIMULATION_PAUSE_MODE
} from "../../../redux/playGroundSlice";
import {useAppSelector} from "../../../Hooks/reduxHooks";
import {stopSimulationHandler} from "../ControlBarHandlers/StopSimulationHandler";


export const StopButton: React.FC = () =>
{
    const currentMode = useAppSelector(state => state.playGround.mode);

    return (
        <button
            onClick={stopSimulationHandler}
            disabled={currentMode !== SIMULATION_MODE && currentMode !== SIMULATION_PAUSE_MODE}
            className={"control--button-stop control-button"}
            type={"button"}>
            Stop
        </button>
    );
}