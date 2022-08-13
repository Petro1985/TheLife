import {EDIT_MODE, PATTERN_MODE, setIntervalId, setSimulationMode} from "../../../redux/playGroundSlice";
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

    console.log('Path?',window.location.pathname.includes('pattern'));

    if (window.location.pathname.includes('pattern')) 
    {
        dispatch(setSimulationMode(PATTERN_MODE));
    }
    else
    {
        dispatch(setSimulationMode(EDIT_MODE));
    }
    await simulationHubConnectionService.stopConnection();
}