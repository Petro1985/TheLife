import React from "react";
import "./control-bar.css";
import {
    setSimulationMode,
    setSimulatedField,
    EDIT_MODE,
    SIMULATION_PAUSE_MODE,
    SIMULATION_MODE,
    setIntervalId,
    makeSimulationTurn,
    setSimulationInterval,
    requestSimulationTurns
} from "../../../redux/playGroundSlice";

import {StartNewFieldSimulation} from "../../../ServerApiHandlers/StartFieldSimulation";
import {StopFieldSimulation} from "../../../ServerApiHandlers/StopFieldSimulation";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {log} from "util";

  
const ControlBar: React.FC = () =>
{
    const dispatch = useAppDispatch();
    
    const fieldId = useAppSelector(state => state.field.field.id);
    const simulationInterval = useAppSelector(state => state.playGround.interval);
    const simulationIntervalId = useAppSelector(state => state.playGround.intervalId);
    const currentMode = useAppSelector(state => state.playGround.mode);
    const simulatedFieldId = useAppSelector(state => state.playGround.simulatedField.id);
    
    async function makeTurn() {
        dispatch(makeSimulationTurn());
        dispatch(requestSimulationTurns());
        console.log('turn was made');
    }

    function setSimulationTimer(interval: number)
    {
        if (simulationIntervalId) clearInterval(simulationIntervalId);
        const newIntervalId = window.setInterval(() => makeTurn(), interval);
        dispatch(setIntervalId(newIntervalId));
    }
    
    async function onPlayClick()
    {
        if (currentMode === EDIT_MODE){
            const simulatedFiled = await StartNewFieldSimulation(fieldId);
            dispatch(setSimulatedField(simulatedFiled));
            dispatch(setSimulationMode(SIMULATION_MODE));
            setSimulationTimer(simulationInterval);
        }
    }
    
    async function onPauseClick() {
        switch (currentMode)
        {
            case SIMULATION_MODE:
                dispatch(setSimulationMode(SIMULATION_PAUSE_MODE));
                clearInterval(simulationIntervalId);
                break;
            case SIMULATION_PAUSE_MODE:
                dispatch(setSimulationMode(SIMULATION_MODE));
                setSimulationTimer(simulationInterval);
                break;
        }
    }
    
    async function onStopClick()
    {
        clearInterval(simulationIntervalId);
        dispatch(setIntervalId(0));
        dispatch(setSimulationMode(EDIT_MODE));
        await StopFieldSimulation(simulatedFieldId);
    }

    return (
        <div className={"main-container"}>
            <button
                disabled={currentMode !== EDIT_MODE}
                onClick={onPlayClick} 
                className={"control--button-play green-button"} 
                type={"button"}>
                Start
            </button>
            <button
                disabled={currentMode === EDIT_MODE}
                onClick={onPauseClick} 
                className={"control--button-pause green-button"} 
                type={"button"}>
                {currentMode === SIMULATION_PAUSE_MODE ?"Play" : "Pause"}
            </button>
            <button
                disabled={currentMode === EDIT_MODE}
                onClick={onStopClick} 
                className={"control--button-stop green-button"} 
                type={"button"}>
                Stop
            </button>
            <span className={'intervalControl'}>
                <button 
                    className={'intervalControl--button'}
                    onClick={() => {
                        const newInterval = simulationInterval - 50;
                        dispatch(setSimulationInterval(newInterval));
                        if (currentMode === SIMULATION_MODE)
                        {
                            setSimulationTimer(newInterval);
                        }
                    }}
                >
                    -
                </button>
                
                <input 
                    className={'simulationIntervalInput'}
                    value={simulationInterval}
                    readOnly={true}
                >
                    
                </input>
                
                <button 
                    className={'intervalControl--button'}
                    onClick={() => {
                        const newInterval = simulationInterval + 50;
                        dispatch(setSimulationInterval(newInterval));
                        if (currentMode === SIMULATION_MODE)
                        {
                            setSimulationTimer(newInterval);
                        }
                    }}
                >
                    +
                </button>
            </span>
            
        </div>
    );
}

export default ControlBar;