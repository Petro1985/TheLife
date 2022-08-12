import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../Hooks/reduxHooks";
import {MENU_MODE, setSimulationInterval} from "../../../redux/playGroundSlice";
import {resetInterval} from "../ControlBarHandlers/resetInterval";


export const TurnTimeControl: React.FC<{vertical: Boolean}> = ({vertical}) => {
    
    const turnTime = useAppSelector(state => state.playGround.interval);
    const [turnTimeInputValue, setTurnTimeInputValue] = useState<number>(turnTime);
    
    const currentMode = useAppSelector(state => state.playGround.mode);
    
    const dispatch = useAppDispatch();

    useEffect(()=>
    {
        setTurnTimeInputValue(1000 - turnTime);
        console.log('new time our set ->', 1000 - turnTimeInputValue)
    }
    ,[])
    
    useEffect(()=> 
    {
        dispatch(setSimulationInterval(1000 - turnTimeInputValue));
        console.log('new time our set ->', 1000 - turnTimeInputValue)
        resetInterval(1000 - turnTimeInputValue);
    }
    ,[turnTimeInputValue])
    
    function onTurnTimeInputChange(e: React.ChangeEvent<HTMLInputElement>) 
    {
        console.log('new value!', turnTime)
        setTurnTimeInputValue(parseInt(e.target.value, 10));
    }

    return (
        <span className={'intervalControl'}>
            <div className={vertical ? 'slider-wrapper--vertical' : 'slider-wrapper'}>
                <input
                    id={'TimeRange'}
                    type={'range'}
                    min={0}
                    max={950}
                    step={25}
                    value={turnTimeInputValue}
                    onChange={(e) => onTurnTimeInputChange(e)}
                    disabled={currentMode === MENU_MODE}
                />
            </div>
        </span>
    )
}