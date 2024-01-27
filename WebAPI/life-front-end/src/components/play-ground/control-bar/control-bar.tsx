import React, {useEffect, useState} from "react";
import "./control-bar.css";
import {
    addTurnsToBuffer, EDIT_MODE,
    MENU_MODE, PATTERN_MODE, setCurrentTurn, setIntervalId, setSimulationMode,
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
import {centerHandler} from "../ControlBarHandlers/CenterHandler";


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
                className={'control-button'}
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
                className={'control-button'}
                onClick={_ => centerHandler()}
            >
                <img style={{marginTop: '6px'}} alt="center" src={"Images/four-converging-arrows-at-the-center.svg"}></img>
            </button>

            <button
                className={'control-button'}
                onClick={e => toggleMenu()}
            >
                <img style={{marginTop: '6px'}} alt="shrink-to-left" src={"Images/shrink-to-left.svg"}></img>
            </button>
        </div>
    );
}

export default ControlBar;


