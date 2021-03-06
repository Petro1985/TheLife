import React, {useEffect, useRef, useState} from "react";
import "./menu.css";
import {fetchFieldsInfo} from "../../redux/menuSlice";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {PatternsElement} from "./PatternsElement";
import {TopMenuButtons} from "./TopMenuButtons";
import {UserFields} from "./UserFields";

const Menu: React.FC = () => 
{
    const dispatch = useAppDispatch();

    const [isPatternShown, setIsPatternShown] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<{left:string, width: number}>({left: `calc(50vw - 235px)`, width: 470});
    
    const navigate = useNavigate();

    // effect for loading fieldsInfo from server
    useEffect(() => {
        dispatch(fetchFieldsInfo());
    }, []);
    
    function onPatternClick()
    {
        setIsPatternShown(prev => !prev)
        if (isPatternShown)
        {
            setMenuPosition({left: `calc(50vw - 235px)`, width: 470})
        }
        else
        {
            setMenuPosition({left: `calc(50vw - 475px)`,width:950})
        }
    }

    return (
        <div
            className={`menu-container`}
            style={menuPosition}
        >
            <TopMenuButtons
                patternButtons={isPatternShown}
                onPatternClick={onPatternClick}
            />
            { isPatternShown ?
                <PatternsElement/>
                :
                <UserFields />
            }       
        </div>
            );
}



export default Menu;