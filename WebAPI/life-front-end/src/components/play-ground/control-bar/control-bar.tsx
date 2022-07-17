import React, {useEffect} from "react";
import "./control-bar.css";
import {
    setSimulationMode,
    setSimulatedField,
    EDIT_MODE, SIMULATION_PAUSE_MODE, SIMULATION_MODE, setIntervalId
} from "../../../redux/playGroundSlice";

import {StartNewFieldSimulation} from "../../../ServerApiHandlers/StartFieldSimulation";
import {MakeSimulationTurn} from "../../../ServerApiHandlers/MakeSimulationTurn";
import {StopFieldSimulation} from "../../../ServerApiHandlers/StopFieldSimulation";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";

let deleteLastSimulationFunction = () => {}; 
    
const ControlBar: React.FC = (props) =>
{
    const dispatch = useAppDispatch();
    
    const fieldId = useAppSelector(state => state.field.field.id);
    const intervalId = useAppSelector(state => state.playGround.intervalId);
    const currentMode = useAppSelector(state => state.playGround.mode);
    const simulatedFieldId = useAppSelector(state => state.playGround.simulatedField.id);
    console.log('simulatedFieldId -> ', simulatedFieldId)

    
    async function makeTurn(simFieldId: string) {
        const newSimulatedFiled = await MakeSimulationTurn(simFieldId);
        console.log('newSimulatedFiled -> ',newSimulatedFiled)
        dispatch(setSimulatedField(newSimulatedFiled))
    }

    
    async function onPlayClick()
    {
        if (currentMode === EDIT_MODE){
            const simulatedFiled = await StartNewFieldSimulation(fieldId);
            dispatch(setSimulatedField(simulatedFiled));
            dispatch(setSimulationMode(SIMULATION_MODE));

            console.log(`simulation with ID=${simulatedFiled.id} started`);
            console.log(simulatedFiled);
            const newIntervalId = window.setInterval(() => makeTurn(simulatedFiled.id), 1000);
            dispatch(setIntervalId(newIntervalId));

            deleteLastSimulationFunction = async () => {
                await StopFieldSimulation(simulatedFiled.id)
            }
            window.addEventListener("beforeunload", deleteLastSimulationFunction, true);
        }
    }
    
    async function onPauseClick() {
        switch (currentMode)
        {
            case SIMULATION_MODE:
                dispatch(setSimulationMode(SIMULATION_PAUSE_MODE));
                clearInterval(intervalId);
                break;
            case SIMULATION_PAUSE_MODE:
                dispatch(setSimulationMode(SIMULATION_MODE));
                const newIntervalId = window.setInterval(() => makeTurn(simulatedFieldId), 1000);
                dispatch(setIntervalId(newIntervalId));
                break;
        }
    }
    
    async function onStopClick()
    {
        clearInterval(intervalId);
        dispatch(setIntervalId(0));
        dispatch(setSimulationMode(EDIT_MODE));
        console.log('simulatedFieldId', simulatedFieldId);
        await StopFieldSimulation(simulatedFieldId);
        window.removeEventListener("beforeunload", deleteLastSimulationFunction, true);
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
        </div>
    );
}

export default ControlBar;