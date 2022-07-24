import React, {useEffect} from "react";
import "./control-bar.css";
import {
    addTurnsToBuffer, EDIT_MODE,
    makeSimulationTurn, setIntervalId, setSimulationMode,
    SIMULATION_FIELD_BUFFER_SIZE
} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {StartButton} from "./StartButton";
import {PauseButton} from "./PauseButton";
import {StopButton} from "./StopButton";
import {HubConnection} from "@microsoft/signalr";
import {SimulationHubConnectionService} from "../../../Services/WebSocketConnectionService";
import {TurnTimeControl} from "./TurnTimeControl";
import {store} from "../../../redux/Store";

export const simulationHubConnectionService: SimulationHubConnectionService = new SimulationHubConnectionService();
let currentTurn = 0;

const ControlBar: React.FC<{enabled: boolean}> = ({enabled}) =>
{
    const dispatch = useAppDispatch();
    const currentSimulationMode = useAppSelector(state => state.playGround.mode);
    const intervalId = useAppSelector(state => state.playGround.intervalId);
    const simulationFiledId = useAppSelector(state => state.playGround.simulatedField.id);
    

    useEffect(() =>
    {
        simulationHubConnectionService!.setMessageHandler('FieldsRequest', serverAnswer => {
            dispatch(addTurnsToBuffer(serverAnswer));
            console.log(`Received data from server`);
        });
        return () => {
            window.clearInterval(store.getState().playGround.intervalId);
            dispatch(setIntervalId(0));
            dispatch(setSimulationMode(EDIT_MODE));
            simulationHubConnectionService?.clearMessageHandler('FieldsRequest');
            simulationHubConnectionService?.stopConnection().then(() => console.log('Connection closed!!!!!!!!!!!'));
        }
    }, []);

    useEffect(() =>
    {
        if (currentSimulationMode === EDIT_MODE)
        {
            currentTurn = 0;
        }
    }, [currentSimulationMode])

    const resetInterval = (turnTime: number) =>
    {
        if (intervalId)
        {
            window.clearInterval(intervalId);
            const newIntervalId = window.setInterval(() => intervalHandler(simulationHubConnectionService!.getConnection()!, simulationFiledId), turnTime);
            dispatch(setIntervalId(newIntervalId));
        }
    }
    
    const intervalHandler = async (con: HubConnection, simulatedFieldId: string) =>
    {
        dispatch(makeSimulationTurn());
        currentTurn++;

        if (!con) return;

        try {
            const simulationFieldRequest = {Id: simulatedFieldId, toTurn: currentTurn + SIMULATION_FIELD_BUFFER_SIZE}
            await con.send('SendFields', simulationFieldRequest);
            console.log(`Request ro turn ${currentTurn + SIMULATION_FIELD_BUFFER_SIZE} sent`);
        } catch (e) {
            console.log(e);
        }
    }
    
    return (
        <div className={"main-container"}
             onMouseDown={(e) => 
             {
                 e.stopPropagation();
                 e.preventDefault();
             }}
        >
            <StartButton
                intervalHandler={intervalHandler}
                connectionService={simulationHubConnectionService!}
            />
            <PauseButton
                intervalHandler={intervalHandler}
                connectionService={simulationHubConnectionService!}
            />
            <StopButton
                connectionService={simulationHubConnectionService!}
            />

            <TurnTimeControl
                resetInterval={resetInterval}
            />
        </div>
    );
}

export default ControlBar;


