import React from "react";
import './MiniControlBar.css';
import {startSimulationHandler} from "../ControlBarHandlers/StartHandler";
import {pauseSimulationHandler} from "../ControlBarHandlers/pauseSimulationHandler";
import {stopSimulationHandler} from "../ControlBarHandlers/StopSimulationHandler";
import {
    EDIT_MODE,
    MENU_MODE, PATTERN_MODE,
    setSimulationMode,
    SIMULATION_MODE,
    SIMULATION_PAUSE_MODE
} from "../../../redux/playGroundSlice";
import {BASE_PATH} from "../../../Utilities/BasePath";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {useNavigate} from "react-router-dom";
import {TurnTimeControl} from "../control-bar/TurnTimeControl";
import {centerHandler} from "../ControlBarHandlers/CenterHandler";


export const MiniControlBar: React.FC<{isMiniMenu: boolean, toggleMenu: Function}> = ({isMiniMenu, toggleMenu}) =>
{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentMode = useAppSelector(state => state.playGround.mode);


    return (
        <div className={'flex-vert-container mini-menu ' + (isMiniMenu? "" : "hidden-mini-menu")}>
            <button className={'mini-menu-button mini-menu--max-menu'} onClick={() => toggleMenu()}>{''}</button>

            <button
                className={'mini-menu--play'}
                onClick={startSimulationHandler}
                disabled={currentMode !== EDIT_MODE && currentMode !== PATTERN_MODE}
            ></button>
            
            <button
                className={'mini-menu--pause'}
                onClick={pauseSimulationHandler}
                disabled={currentMode !== SIMULATION_MODE && currentMode !== SIMULATION_PAUSE_MODE}
            >                
            </button>
            
            <button
                className={'mini-menu--stop'}
                onClick={stopSimulationHandler}
                disabled={currentMode !== SIMULATION_MODE && currentMode !== SIMULATION_PAUSE_MODE}
            >
            </button>
            
            <TurnTimeControl vertical={true}/>
            
            <button 
                className={'mini-menu-button mini-menu--center'}
                onClick={_ => centerHandler(100)}
            >                
            </button>
            
            <button 
                className={'mini-menu-button mini-menu--menu'}
                onClick={async () => {
                    await stopSimulationHandler();
                    dispatch(setSimulationMode(MENU_MODE));
                    navigate(BASE_PATH + '/menu');
                }}
            >
                M
            </button>
        </div>
    );
}