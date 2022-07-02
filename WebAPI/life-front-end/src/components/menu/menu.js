import React, {useEffect, useState} from "react";
import "./menu.css";
import {getFieldFromServer, setField} from "../../redux/Actions";
import {useDispatch} from "react-redux";
import {GetAllMapsInfoFromServer} from "../../Utilities/GetFieldsInfoFromServer";
import {createNewFieldOnServer} from "../../Utilities/UpdateFieldOnServer";
import {DeleteFieldOnServer} from "../../Utilities/DeleteFieldOnServer";

export default function Menu(props)
{
    const NEW_FIELD_ID = -1;
    
    const dispatch = useDispatch();    
    const [fieldsInfo, setFieldsInfo] = useState([])


    async function MenuButtonClicked(number) {
        console.log("Menu clicked")

        if (number > -1) 
        {        
            dispatch(getFieldFromServer(fieldsInfo[number].id, fieldsInfo[number].name));
        }
        else
        {
            const fieldId = await createNewFieldOnServer();
            const field = {id:fieldId, name: "", survivors: []}
            dispatch(setField(field));
            console.log("id set? ->", fieldId)
        }
        console.log("App state changed")
        props.AppStateSetter(oldState => oldState + 1);
        
    }

    async function OnDeleteFieldClicked(ind) {
        await DeleteFieldOnServer(fieldsInfo[ind].id);
        setFieldsInfo(oldValue => {
            return oldValue.filter((fieldInfo, i) => i !== ind);
        });
    }

    useEffect(() => {
            async function fetchData() {
                const mapsInfo = await GetAllMapsInfoFromServer();
                setFieldsInfo(mapsInfo);
            }
            fetchData();
        }, []
    )

    const maps = fieldsInfo.map((mapInfo, ind) => 
    {
        return (
            <div key={"MenuContainer" + mapInfo.id} className={"menu--item-container"}>
                <img 
                    key={"MenuImg" + ind}
                    className={"menu--button-image"}
                    src={'data:image/png;base64,' + mapInfo.minimapBase64}
                    alt={"Minimap"} />                
                <div className={"menu--vertical-container"}>
                    <div className={"menu--field-name"}>
                        <span><strong>Name:</strong> {mapInfo.name ? mapInfo.name : "Unnamed"}</span>
                        <button className={"menu--field-rename-button"}></button>
                    </div>
                    <div><strong>Last change: </strong>01.07.2022 at 16:50</div>

                    <div id={"qwe"}>
                        <button
                            onClick={() => MenuButtonClicked(ind)}
                            key={"MenuButton" + ind}
                            className={"green-button menu--choose-button"}>
                            Choose
                        </button>
                        <button
                            onClick={() => OnDeleteFieldClicked(ind)}
                            className={"menu--delete-field-button"}
                            >
                        </button>
                    </div>

                </div>
                
            </div>
        );
    });
    

    return (
        <div className={"menu"}>
            <button 
                key={"Menu_NewButton"} 
                onClick={() => MenuButtonClicked(NEW_FIELD_ID)}
                className={"green-button"}>
                New field
            </button>
            {maps}
        </div>);
}
