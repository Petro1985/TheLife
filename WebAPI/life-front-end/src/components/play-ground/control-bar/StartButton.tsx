import React from "react";
import {
    EDIT_MODE,
    setIntervalId,
    startNewFieldSimulation
} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {SimulationHubConnectionService} from "../../../Services/WebSocketConnectionService";

export const StartButton: React.FC<{intervalHandler: Function, connectionService: SimulationHubConnectionService}> = 
    ({intervalHandler, connectionService}) =>
{

    const currentMode = useAppSelector(state => state.playGround.mode);
    const fieldId = useAppSelector(state => state.field.field.id);
    const interval = useAppSelector(state => state.playGround.interval);
    const dispatch = useAppDispatch();
    

    async function onStartPressed(e: React.MouseEvent) {
        const simulatedFieldId = (await dispatch(startNewFieldSimulation(fieldId)).unwrap()).id;

        const connection = connectionService.getConnection();
        await connectionService.startConnection();
        const intervalId = window.setInterval(() => intervalHandler(connection, simulatedFieldId), interval);
        dispatch(setIntervalId(intervalId));
    }

    return ( 
        <button
            disabled={currentMode !== EDIT_MODE}
            className={"control--button-play green-button"}
            type={"button"}
            onClick={onStartPressed}
        >
            Start
        </button>
    );
}