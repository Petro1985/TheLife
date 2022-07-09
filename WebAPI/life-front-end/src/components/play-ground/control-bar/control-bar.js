import React from "react";
import "./control-bar.css";
import {
    setSimulationMode,
    setSimulatedField,
    clearIntervalTimer,
    EDIT_MODE, SIMULATION_PAUSE_MODE, SIMULATION_MODE, setIntervalId
} from "../../../redux/playGroundSlice";

import {useDispatch, useSelector} from "react-redux";
import {setFieldSimulation} from "../../../ServerApiHandlers/setSimulationField";
import {makeSimulationTurn} from "../../../ServerApiHandlers/makeSimulationTurn";

export default function ControlBar(props) {
    async function makeTurn() {
        const newSimulatedFiled = await makeSimulationTurn();
        dispatch(setSimulatedField(newSimulatedFiled))
    }

    const dispatch = useDispatch();
    const playGroundMode = useSelector((state) => state.playGround.mode);

    const fieldId = useSelector(state => state.field.field.id);
    const intervalId = useSelector(state => state.playGround.intervalId);
    const currentMode = useSelector(state => state.playGround.mode);
    
    async function onPlayClick()
    {
        if (currentMode === EDIT_MODE){
            const simulatedFiled = await setFieldSimulation(fieldId);
            dispatch(setSimulatedField(simulatedFiled));
            dispatch(setSimulationMode(SIMULATION_MODE));

            const newIntervalId = setInterval(makeTurn, 1000);
            dispatch(setIntervalId(newIntervalId));
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
                const newIntervalId = setInterval(makeTurn, 1000);
                dispatch(setIntervalId(newIntervalId));
                break;
        }
    }
    
    async function onStopClick()
    {
        clearInterval(intervalId);
        dispatch(setIntervalId(null));
        dispatch(setSimulationMode(EDIT_MODE));
    }

    return (
        <div className={"main-container"}>
            <button
                disabled={currentMode !== EDIT_MODE}
                onClick={onPlayClick} 
                className={"control--button-play green-button"} 
                type={"button"}>
                Play
            </button>
            <button
                disabled={currentMode === EDIT_MODE}
                onClick={onPauseClick} 
                className={"control--button-pause green-button"} 
                type={"button"}>
                Pause
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
