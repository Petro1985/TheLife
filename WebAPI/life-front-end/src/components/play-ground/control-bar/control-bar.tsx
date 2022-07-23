import React, {useCallback, useEffect} from "react";
import "./control-bar.css";
import {
    addTurnsToBuffer, EDIT_MODE,
    makeSimulationTurn, setIntervalId,
    SIMULATION_FIELD_BUFFER_SIZE
} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {StartButton} from "./StartButton";
import {PauseButton} from "./PauseButton";
import {StopButton} from "./StopButton";
import {HubConnection} from "@microsoft/signalr";
import {SimulationHubConnectionService} from "../../../Services/WebSocketConnectionService";
import {TurnTimeControl} from "./TurnTimeControl";

const simulationHubConnectionService = new SimulationHubConnectionService();
let currentTurn = 0;

const ControlBar: React.FC = () =>
{
    const dispatch = useAppDispatch();
    const currentSimulationMode = useAppSelector(state => state.playGround.mode);
    const intervalId = useAppSelector(state => state.playGround.intervalId);
    const simulationFiledId = useAppSelector(state => state.playGround.simulatedField.id);

    const resetInterval = useCallback((turnTime: number) =>
    {
        if (intervalId)
        {
            window.clearInterval(intervalId);
            const newIntervalId = window.setInterval(() => intervalHandler(simulationHubConnectionService.getConnection()!, simulationFiledId), turnTime);
            dispatch(setIntervalId(newIntervalId));
        }
    }, [intervalId, simulationFiledId])

    useEffect(() =>
    {
        simulationHubConnectionService.setMessageHandler('ReceiveMessage', serverAnswer => {
            console.log('Received:', serverAnswer);
            dispatch(addTurnsToBuffer(serverAnswer));
        });
    }, []);
    
    useEffect(() =>
    {
        if (currentSimulationMode === EDIT_MODE)
        {
            currentTurn = 0;
        }
    }, [currentSimulationMode])
    

    
    const intervalHandler = async (con: HubConnection, simulatedFieldId: string) =>
    {
        dispatch(makeSimulationTurn());
        currentTurn++;
        console.log('currentTurn', currentTurn)
        
        if (!con) return;

        try {
            const simulationFieldRequest = {Id: simulatedFieldId, toTurn: currentTurn + SIMULATION_FIELD_BUFFER_SIZE}
            await con.send('SendMessage', simulationFieldRequest);
            console.log('sent: ', simulationFieldRequest);
        } catch (e) {
            console.log(e);
        }
    }
      
    return (
        <div className={"main-container"}>
            <StartButton
                intervalHandler={intervalHandler}
                connectionService={simulationHubConnectionService}
            />
            <PauseButton
                intervalHandler={intervalHandler}
                connectionService={simulationHubConnectionService}
            />
            <StopButton
                connectionService={simulationHubConnectionService}
            />

            <TurnTimeControl
                resetInterval={resetInterval}
            />
        </div>
    );
}

export default ControlBar;


