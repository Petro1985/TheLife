import React from "react";
import {setIntervalId, startNewFieldSimulation} from "../../../redux/playGroundSlice";
import {store} from "../../../redux/Store";
import {intervalHandler} from "./intervalHandler";
import {simulationHubConnectionService} from "../play-ground";

export async function startSimulationHandler(e: React.MouseEvent) {
    const dispatch = store.dispatch;
    const interval = store.getState().playGround.interval;
    const fieldId = store.getState().field.field.id;
    
    const simulatedFieldId = (await dispatch(startNewFieldSimulation(fieldId)).unwrap()).id;

    const connection = simulationHubConnectionService.getConnection();
    await simulationHubConnectionService.startConnection();
    const intervalId = window.setInterval(() => intervalHandler(connection!, simulatedFieldId), interval);
    dispatch(setIntervalId(intervalId));
}