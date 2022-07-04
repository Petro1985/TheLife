import React, {useEffect, useRef, useState} from "react";
import {getFieldFromServer, setField} from "../../redux/Actions";
import {useDispatch} from "react-redux";

export default function MenuItem({ind, fieldInfo, AppStateSetter, ChangeFieldName}){
    const EMPTY_EDIT_MODE = {active:false, editedName: ""};
    const [editMode, setEditMode] = useState(EMPTY_EDIT_MODE)
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    function onEditFieldNameClick(ind)
    {
        setEditMode({active: true, editedFieldId: ind, editedName: fieldInfo.name});
    }

    function onFieldNameInputChange(event, ind) {
        setEditMode(old => {
                const newValue = {...old};
                old.editedName = event.target.value;
                return newValue;
            }
        );
    }
    async function MenuButtonClicked(number) {
        dispatch(getFieldFromServer(fieldInfo.id, fieldInfo.name));
        AppStateSetter(oldState => oldState + 1);
    }

    async function OnDeleteFieldClicked(ind) {
        
    }
    
    // effect for focusing input
    useEffect(() => {
        if (editMode.active) {
            inputRef.current.focus();
        }
    }, [editMode])

    function onFieldNameInputKeyDown(event, ind) {
        switch (event.key){
            case 'Enter':
                ChangeFieldName(ind, editMode.editedName);
            case 'Escape':
                setEditMode(EMPTY_EDIT_MODE);
                break;
        }
    }    
    return (
        <div key={"MenuItemContainer" + fieldInfo.id} className={"menu--item-container"}>
            <img
                key={"MenuImg" + ind}
                className={"menu--button-image"}
                src={'data:image/png;base64,' + fieldInfo.minimapBase64}
                alt={"Minimap"} />
            <div className={"menu--vertical-container"}>
                <div className={"menu--field-name"}>
                     <span><strong>Name:</strong>
                         {editMode.active ?
                             <input
                                id={"InputField"+ind}
                                ref={inputRef}
                                className={"menu--field-rename-input"}
                                value={editMode.editedName}
                                onChange={(event) => onFieldNameInputChange(event, ind)}
                                onKeyDown={(event) => onFieldNameInputKeyDown(event, ind)}
                                onBlur={() => setEditMode(EMPTY_EDIT_MODE)}
                            /> 
                             :
                            (<>{(fieldInfo.name ? fieldInfo.name : "Unnamed")}
                                        <button onClick={() => onEditFieldNameClick(ind)} className={"menu--field-rename-button"}></button>
                            </>)}
                            </span>
    
                </div>
                <div><strong>Last change: </strong>01.07.2022 at 16:50</div>
    
                <div className={"menu--field--choose-delete-buttons"}>
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
} 
