import React from "react";
import {EDIT_MODE, setIntervalId, setSimulationMode} from "../../../redux/playGroundSlice";
import {store} from "../../../redux/Store";
import {simulationHubConnectionService} from "../play-ground";

export async function stopSimulationHandler()
{
    const intervalId = store.getState().playGround.intervalId;
    const dispatch = store.dispatch;
    
    if (intervalId) {
        window.clearInterval(intervalId);
        dispatch(setIntervalId(0));
    }
    dispatch(setSimulationMode(EDIT_MODE));
    await simulationHubConnectionService.stopConnection();
}