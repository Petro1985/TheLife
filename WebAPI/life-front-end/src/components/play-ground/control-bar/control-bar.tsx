import React, {useEffect, useState} from "react";
import "./control-bar.css";
import {
    addTurnsToBuffer, EDIT_MODE,
    MENU_MODE, setCurrentTurn, setIntervalId, setSimulationMode,
} from "../../../redux/playGroundSlice";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {StartButton} from "./StartButton";
import {PauseButton} from "./PauseButton";
import {StopButton} from "./StopButton";
import {simulationHubConnectionService} from "../play-ground";
import {TurnTimeControl} from "./TurnTimeControl";
import {store} from "../../../redux/Store";
import {useNavigate} from "react-router-dom";
import {BASE_PATH} from "../../../Utilities/BasePath";
import {stopSimulationHandler} from "../ControlBarHandlers/StopSimulationHandler";


const ControlBar: React.FC<{isMiniMenu: boolean, toggleMenu: Function}> = ({isMiniMenu, toggleMenu}) =>
{
    const dispatch = useAppDispatch();
    const currentSimulationMode = useAppSelector(state => state.playGround.mode);
    const intervalId = useAppSelector(state => state.playGround.intervalId);

    const navigate = useNavigate();

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
        }
    }, []);

    useEffect(() =>
    {
        if (currentSimulationMode === EDIT_MODE)
        {
            dispatch(setCurrentTurn(0));
        }
    }, [currentSimulationMode])

 
    return (
        <div 
            className={"main-container " + (isMiniMenu ? "hidden-main-container" : "")}
            onMouseDown={e => e.stopPropagation()}
        >
            <StartButton/>
            
            <PauseButton/>
            
            <StopButton/>
            
            <button 
                disabled={currentSimulationMode === MENU_MODE}
                className={'green-button'}
                onClick={async (e) => {
                    await stopSimulationHandler();
                    dispatch(setSimulationMode(MENU_MODE));
                    navigate(BASE_PATH + '/menu');
                }}
            >Menu</button>

            <TurnTimeControl
                vertical={false}
            />
            
            <button
                disabled={currentSimulationMode === MENU_MODE}
                className={'green-button'}
                onClick={e => 0}
            >Center</button>

            <button
                className={'green-button'}
                onClick={e => toggleMenu()}
            >{'<<<'}</button>
        </div>
    );
}

export default ControlBar;


