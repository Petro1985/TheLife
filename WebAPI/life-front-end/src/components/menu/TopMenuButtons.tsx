import React, {MouseEventHandler} from "react";
import {createNewField} from "../../redux/fieldSlice";
import {EDIT_MODE, setSimulationMode} from "../../redux/playGroundSlice";
import {useAppDispatch} from "../../Hooks/reduxHooks";
import {useNavigate} from "react-router-dom";


export const TopMenuButtons: React.FC<{onPatternClick: MouseEventHandler}> = ({onPatternClick}) =>
{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    async function MenuNewFieldClicked() {
        dispatch(createNewField()).unwrap().then((field) => {
            if (field)
            {
                dispatch(setSimulationMode(EDIT_MODE));
                navigate('/field?id='+field.id);
            }
            else
            {
                // ToDo: Need to add some message for user, that couldn't create a field
            }
        });
    }
    
    
    
    
    return (                
        <div>
            <button
                key={"Menu_NewButton"}
                onClick={() => MenuNewFieldClicked()}
                className={"green-button"}>
                New field
            </button>
            <button
                key={"Menu_PatternButton"}
                onClick={onPatternClick}
                className={"green-button"}>
                {`Patterns =>`}
            </button>
        </div>)
}    