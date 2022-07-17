import React, {useEffect, useRef, useState} from "react";
import "./menu.css";
import MenuItem from "./MenuItem";
import {createNewField} from "../../redux/fieldSlice";
import {fetchFieldsInfo} from "../../redux/menuSlice";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";

const Menu: React.FC = () => 
{
    const dispatch = useAppDispatch();
    const fieldsInfo = useAppSelector(state => state.menu.menu);
    const [topField, setTopField] = useState(0);
    const menuElement = useRef(null);
    const navigate = useNavigate();

    // effect for loading fieldsInfo from server
    useEffect(() => {
        dispatch(fetchFieldsInfo());
    }, []);
    
    const fields = fieldsInfo.map((mapInfo, ind) => 
    {
        return (
            <MenuItem
                key={"MenuItem"+ind}
                ind = {ind}
            />
        );
    }).slice(topField,topField + 3);

    async function MenuNewFieldClicked() {
        dispatch(createNewField()).unwrap().then((field) => {
            if (field)
            {
                navigate('/field?id='+field.id);
            }
            else
            {
                // ToDo: Need to add some message for user, that couldn't create a field
            }
        });
    }

    return (
        <div 
            className={"menu"}
            ref={menuElement}
        >
            <button 
                key={"Menu_NewButton"}
                onClick={() => MenuNewFieldClicked()}
                className={"green-button"}>
                New field
            </button>
            <div 
                onClick={() => {setTopField(x => x - 1)}} 
                className={"menu--arrow-up"} 
                style={{visibility: topField ? "visible" : "hidden"}}>                
            </div>            
            
            {fields}
            
            <div
                onClick={() => {setTopField(x => x + 1)}}
                className={"menu--arrow-down"}
                style={{visibility: (topField + 3 < fieldsInfo.length) ? "visible" : "hidden"}}
            >                
            </div>
            
        </div>);
}

export default Menu;