import React, {useEffect, useRef, useState} from "react";
import "./menu.css";
import {useDispatch, useSelector} from "react-redux";
import MenuItem from "./MenuItem";
import {createNewField, setField} from "../../redux/fieldSlice";
import {fetchFieldsInfo} from "../../redux/menuSlice";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function Menu(props)
{
    const dispatch = useDispatch();
    const fieldsInfo = useSelector(state => state.menu.menu);
    const [topField, setTopField] = useState(0);
    const menuElement = useRef(null);
    const navigate = useNavigate();

    let [searchParams, setSearchParams] = useSearchParams();

    // effect for loading fieldsInfo from server
    useEffect(() => {
        dispatch(fetchFieldsInfo());
    }, []);
    
    //const menuItemsCount = window.innerHeight*0.9;
    
    const fields = fieldsInfo.map((mapInfo, ind) => 
    {
        return (
            <MenuItem
                key={"MenuItem"+ind}
                AppStateSetter = {props.AppStateSetter}
                ind = {ind}
            />
        );
    }).slice(topField,topField + 3);

    async function MenuNewFieldClicked() {
        dispatch(createNewField()).unwrap().then((arg) => {
            navigate('/field?id='+arg.id);
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
