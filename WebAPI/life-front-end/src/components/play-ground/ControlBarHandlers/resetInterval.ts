import {intervalHandler} from "./intervalHandler";
import {setIntervalId} from "../../../redux/playGroundSlice";
import {simulationHubConnectionService} from "../play-ground";
import {store} from "../../../redux/Store";

export const resetInterval = (turnTime: number) =>
{
    const intervalId = store.getState().playGround.intervalId;
    const simulationFiledId = store.getState().playGround.simulatedField.id;    
    
    if (intervalId)
    {
        window.clearInterval(intervalId);
        const newIntervalId = window.setInterval(() => intervalHandler(simulationHubConnectionService!.getConnection()!, simulationFiledId), turnTime);
        store.dispatch(setIntervalId(newIntervalId));
    }
}