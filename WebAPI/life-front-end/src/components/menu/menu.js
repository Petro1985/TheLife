import React, {useEffect, useState} from "react";
import "./menu.css";
import {useDispatch, useSelector} from "react-redux";
import {createNewFieldOnServer} from "../../ServerApiHandlers/UpdateFieldOnServer";
import MenuItem from "./MenuItem";
import {createNewField, setField} from "../../redux/fieldSlice";
import {fetchFieldsInfo} from "../../redux/menuSlice";

export default function Menu(props)
{
    const dispatch = useDispatch();
    const fieldsInfo = useSelector(state => state.menu.menu);
    const [topField, setTopField] = useState(0);
    
    // effect for loading fieldsInfo from server
    useEffect(() => {
        dispatch(fetchFieldsInfo());
    }, []);
    
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
        dispatch(createNewField());
        props.AppStateSetter(oldState => oldState + 1);
    }
    console.log(topField && "up arrow")
    console.log((topField + 3 < fieldsInfo.length) && "down arrow")
    
    return (
        <div className={"menu"}>
            <button 
                key={"Menu_NewButton"}
                onClick={() => MenuNewFieldClicked()}
                className={"green-button"}>
                New field
            </button>
            {topField ? 
                <div onClick={() => {setTopField(x => x - 1)}} className={"menu--arrow-up"}></div> 
                : <div className={"menu-invisible-arrow"}></div>}
            
            {fields}
            
            {(topField + 3 < fieldsInfo.length) ?
                <div onClick={() => {setTopField(x => x + 1)}} className={"menu--arrow-down"}></div>
                : <div className={"menu-invisible-arrow"}></div>}
        </div>);
}
