﻿import React, {useEffect, useState} from "react";
import {
    addTurnsToBuffer,
    EDIT_MODE,
    makeSimulationTurn, 
    setIntervalId,
    startNewFieldSimulation
} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {SERVER_ADDRESS} from "../../../Utilities/serverAddress";
import {SimulationHubConnectionService} from "../../../Services/WebSocketConnectionService";

export const StartButton: React.FC<{intervalHandler: Function, connectionService: SimulationHubConnectionService}> = 
    ({intervalHandler, connectionService}) =>
{

    const currentMode = useAppSelector(state => state.playGround.mode);
    const fieldId = useAppSelector(state => state.field.field.id);
    const interval = useAppSelector(state => state.playGround.interval);
    const dispatch = useAppDispatch();
    

    async function onStartPressed() {
        const simulatedFieldId = (await dispatch(startNewFieldSimulation(fieldId)).unwrap()).id;

        const connection = connectionService.getConnection();
        console.log('Got connection', connection);
        await connectionService.startConnection();
        console.log('Got connection (after start)', connection);

        const intervalId = window.setInterval(() => intervalHandler(connection, simulatedFieldId), interval);
        dispatch(setIntervalId(intervalId));
        console.log('interval set')
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