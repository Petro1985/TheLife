import React, {useEffect, useState} from "react";
import "./menu.css";
import {useDispatch, useSelector} from "react-redux";
import {createNewFieldOnServer} from "../../ServerApiHandlers/UpdateFieldOnServer";
import MenuItem from "./MenuItem";
import {setField} from "../../redux/fieldSlice";
import {fetchFieldsInfo} from "../../redux/menuSlice";

export default function Menu(props)
{
    const dispatch = useDispatch();
    const fieldsInfo = useSelector(state => state.menu.menu);
    console.log("fieldInfo ->" , fieldsInfo)
    // const [fieldsInfo, setFieldsInfo] = useState([])

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
    });

    async function MenuNewFieldClicked() {
        const fieldId = await createNewFieldOnServer();
        const field = {id: fieldId, name: "", survivors: []}
        dispatch(setField(field));
        props.AppStateSetter(oldState => oldState + 1);
    }

    return (
        <div className={"menu"}>
            <button 
                key={"Menu_NewButton"}
                onClick={() => MenuNewFieldClicked()}
                className={"green-button"}>
                New field
            </button>
            {fields}
        </div>);
}
