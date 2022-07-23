import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {setSimulationInterval} from "../../../redux/playGroundSlice";
import {log} from "util";


export const TurnTimeControl: React.FC<{resetInterval: Function}> = ({resetInterval}) => {
    
    const turnTime = useAppSelector(state => state.playGround.interval);
    const intervalId = useAppSelector(state => state.playGround.intervalId);
    const [turnTimeInputValue, setTurnTimeInputValue] = useState<string>(turnTime.toString());
    const dispatch = useAppDispatch();
    
    function onTurnTimeInputChange(e: React.ChangeEvent<HTMLInputElement>) 
    {
        setTurnTimeInputValue(e.target.value);
        const turnTime = parseInt(e.target.value, 10);
        dispatch(setSimulationInterval(turnTime));
        resetInterval(turnTime);
    }

    function OnTurnTimeInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) 
    {
        console.log(e.key)
        if (e.key < '0' || e.key > '9' && e.key.length === 1)
        {
            e.preventDefault();
        }
    }

    return (
        <span className={'intervalControl'}>
        <button
            className={'intervalControl--button'}
            onClick={() => {}}
        >
            -
        </button>

        <input
            className={'simulationIntervalInput'}
            //readOnly={true}
            value={turnTimeInputValue}
            onKeyDown={e => OnTurnTimeInputKeyDown(e)}
            onChange={onTurnTimeInputChange}
        />
            
        <button
            className={'intervalControl--button'}
            onClick={() => {
            }}
        >
            +
        </button>
    </span>
    )
}