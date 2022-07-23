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

export const PauseButton: React.FC<{intervalHandler: Function, connectionService: SimulationHubConnectionService}> = 
    ({intervalHandler, connectionService}) =>
{
    const currentMode = useAppSelector(state => state.playGround.mode);
    const simulatedFieldId = useAppSelector(state => state.playGround.simulatedField.id);
    const interval = useAppSelector(state => state.playGround.interval);
    const intervalId = useAppSelector(state => state.playGround.intervalId);
    const dispatch = useAppDispatch();

    async function onPauseButtonClick() {
        if (currentMode == SIMULATION_PAUSE_MODE) 
        {
            const connection = connectionService.getConnection();
            dispatch(setSimulationMode(SIMULATION_MODE))
            
            const intervalId = window.setInterval(() => intervalHandler(connection, simulatedFieldId), interval);
            dispatch(setIntervalId(intervalId));
        }
        else if (currentMode === SIMULATION_MODE) 
        {
            if (intervalId)
            {
                //await connectionService.stopConnection();
                window.clearInterval(intervalId);
                dispatch(setIntervalId(0));
            }
            
            dispatch(setSimulationMode(SIMULATION_PAUSE_MODE))
        }
    }

    return (
        <button
            onClick={onPauseButtonClick}
            disabled={currentMode === EDIT_MODE}
            className={"control--button-pause green-button"}
            type={"button"}>
            {currentMode === SIMULATION_PAUSE_MODE ?"Play" : "Pause"}
        </button>
    );
}