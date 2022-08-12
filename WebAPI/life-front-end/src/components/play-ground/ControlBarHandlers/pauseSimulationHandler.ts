import React from "react";
import {setIntervalId, setSimulationMode, SIMULATION_MODE, SIMULATION_PAUSE_MODE} from "../../../redux/playGroundSlice";
import {store} from "../../../redux/Store";
import {current} from "@reduxjs/toolkit";
import {simulationHubConnectionService} from "../play-ground";
import {intervalHandler} from "./intervalHandler";

export async function pauseSimulationHandler() {
    
    const state = store.getState();
    const dispatch = store.dispatch;
    const currentMode = state.playGround.mode;
    const simulatedFieldId = state.playGround.simulatedField.id;
    const interval = state.playGround.interval;
    const intervalId = state.playGround.intervalId;
    
    
    if (currentMode == SIMULATION_PAUSE_MODE)
    {
        const connection = simulationHubConnectionService.getConnection();
        dispatch(setSimulationMode(SIMULATION_MODE))

        const intervalId = window.setInterval(() => intervalHandler(connection!, simulatedFieldId), interval);
        dispatch(setIntervalId(intervalId));
    }
    else if (currentMode === SIMULATION_MODE)
    {
        if (intervalId)
        {
            window.clearInterval(intervalId);
            dispatch(setIntervalId(0));
        }
        dispatch(setSimulationMode(SIMULATION_PAUSE_MODE))
    }
}