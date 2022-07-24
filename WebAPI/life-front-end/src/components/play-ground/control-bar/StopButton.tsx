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


export const StopButton: React.FC<{connectionService: SimulationHubConnectionService}> = ({connectionService}) =>
{
    const currentMode = useAppSelector(state => state.playGround.mode);
    const intervalId = useAppSelector(state => state.playGround.intervalId);
    const dispatch = useAppDispatch();

    async function OnStopButtonClick() 
    {
        if (intervalId) {
            window.clearInterval(intervalId);
            dispatch(setIntervalId(0));
        }
        
        dispatch(setSimulationMode(EDIT_MODE));
        await connectionService.stopConnection();
    }

    return (
        <button
            onClick={OnStopButtonClick}
            disabled={currentMode !== SIMULATION_MODE && currentMode !== SIMULATION_PAUSE_MODE}
            className={"control--button-stop green-button"}
            type={"button"}>
            Stop
        </button>
    );
}