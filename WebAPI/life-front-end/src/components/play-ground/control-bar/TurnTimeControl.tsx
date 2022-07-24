﻿import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {MENU_MODE, setSimulationInterval} from "../../../redux/playGroundSlice";


export const TurnTimeControl: React.FC<{resetInterval: Function}> = ({resetInterval}) => {
    
    const turnTime = useAppSelector(state => state.playGround.interval);
    const [turnTimeInputValue, setTurnTimeInputValue] = useState<number>(turnTime);
    
    const currentMode = useAppSelector(state => state.playGround.mode);
    
    const dispatch = useAppDispatch();

    useEffect(()=> 
    {
        dispatch(setSimulationInterval(turnTimeInputValue));
        resetInterval(turnTimeInputValue);
    }
    ,[turnTimeInputValue])
    
    function onTurnTimeInputChange(e: React.ChangeEvent<HTMLInputElement>) 
    {
        const turnTime = parseInt(e.target.value, 10);
        setTurnTimeInputValue(turnTime);
    }

    function OnTurnTimeInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) 
    {
        if (e.key < '0' || e.key > '9' && e.key.length === 1)
        {
            e.preventDefault();
        }
    }

    return (
        <span className={'intervalControl'}>
        <button
            className={'intervalControl--button'}
            disabled={currentMode === MENU_MODE}
            onClick={() => {
                setTurnTimeInputValue(old => old - 50);
            }}
        >
            -
        </button>

        <input
            className={'simulationIntervalInput'}
            value={turnTimeInputValue}
            onKeyDown={e => OnTurnTimeInputKeyDown(e)}
            onChange={onTurnTimeInputChange}
            disabled={currentMode === MENU_MODE}
        />
            
        <button
            className={'intervalControl--button'}
            disabled={currentMode === MENU_MODE}
            onClick={() => {
                setTurnTimeInputValue(old => old + 50);
            }}
        >
            +
        </button>
    </span>
    )
}