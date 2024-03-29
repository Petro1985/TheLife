﻿import React from "react";
import {
    EDIT_MODE, PATTERN_MODE,
} from "../../../redux/playGroundSlice";
import {useAppSelector} from "../../../Hooks/reduxHooks";
import {startSimulationHandler} from "../ControlBarHandlers/StartHandler";

export const StartButton: React.FC = () =>
{
    const currentMode = useAppSelector(state => state.playGround.mode);

    return ( 
        <button
            disabled={currentMode !== EDIT_MODE && currentMode !== PATTERN_MODE}
            className={"control--button-play control-button"}
            type={"button"}
            onClick={startSimulationHandler}
        >
            Start
        </button>
    );
}