import React, {useEffect, useRef, useState} from "react";
import "./menu.css";
import {getFieldFromServer, setField} from "../../redux/Actions";
import {useDispatch} from "react-redux";
import {GetAllMapsInfoFromServer} from "../../ServerApiHandlers/GetFieldsInfoFromServer";
import {createNewFieldOnServer} from "../../ServerApiHandlers/UpdateFieldOnServer";
import {DeleteFieldOnServer} from "../../ServerApiHandlers/DeleteFieldOnServer";
import MenuItem from "./MenuItem";

export default function Menu(props)
{
    const NEW_FIELD_ID = -1;
    
    const dispatch = useDispatch();    
    const [fieldsInfo, setFieldsInfo] = useState([])

    // effect for loading fieldsInfo from server
    useEffect(() => {
        async function fetchData() {
            const fieldsInfo = await GetAllMapsInfoFromServer();
            setFieldsInfo(fieldsInfo);
        }
        fetchData();
    }, []);

    function ChangeFieldName(ind, newName)
    {
        setFieldsInfo(oldValue => {
            const newValue = oldValue.slice();
            newValue[ind].name = newName;
            return newValue;
        })
    }
    
    async function OnDeleteFieldClicked(ind) {
        await DeleteFieldOnServer(ind);
        setFieldsInfo(oldValue => {
            return oldValue.filter((fieldInfo, i) => i !== ind);
        });
    }


    const fields = fieldsInfo.map((mapInfo, ind) => 
    {
        return (
            <MenuItem
                key={"MenuItem"+ind}
                onDeleteFieldClicked = {() => OnDeleteFieldClicked(ind)}
                AppStateSetter = {props.AppStateSetter}
                ChangeFieldName = {ChangeFieldName}
                ind = {ind}
                fieldInfo = {fieldsInfo[ind]}
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
