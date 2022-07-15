import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchFieldById} from "../../redux/fieldSlice";
import {deleteItem, renameField, renameItem} from "../../redux/menuSlice";
import {DeleteFieldOnServer} from "../../ServerApiHandlers/DeleteFieldOnServer";
import {useNavigate} from 'react-router-dom';

export default function MenuItem({ind, AppStateSetter}){
    const EMPTY_EDIT_MODE = {active:false, editedName: ""};
    const [editMode, setEditMode] = useState(EMPTY_EDIT_MODE)
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const navigate = useNavigate();
    
    const fieldInfo = useSelector(state => state.menu.menu[ind]);
    const fieldLastChange = new Date(fieldInfo.lastChange);

    function onEditFieldNameClick(ind)
    {
        setEditMode({active: true, editedFieldId: ind, editedName: fieldInfo.name});
    }

    function onFieldNameInputChange(event, ind) {
        setEditMode(old => {
                const newValue = {...old};
                newValue.editedName = event.target.value;
                return newValue;
            }
        );
    }
    async function MenuButtonClicked() {
        dispatch(fetchFieldById(fieldInfo.id))
            .then(() => navigate('/field?id='+fieldInfo.id));
    }

    async function OnDeleteFieldClicked(ind) {
        await DeleteFieldOnServer(fieldInfo.id);
        dispatch(deleteItem(ind));
    }
    
    // effect for focusing input
    useEffect(() => {
        if (editMode.active) {
            inputRef.current.focus();
        }
    }, [editMode])

    function onFieldNameInputKeyDown(event) {
        switch (event.key){
            case 'Enter':
                dispatch(renameField({fieldId: fieldInfo.id, ind:ind, newName:editMode.editedName}));
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
                     <span><strong>Name: </strong>
                         {editMode.active ?
                             <input
                                id={"InputField"+ind}
                                ref={inputRef}
                                className={"menu--field-rename-input"}
                                value={editMode.editedName}
                                onChange={(event) => onFieldNameInputChange(event)}
                                onKeyDown={(event) => onFieldNameInputKeyDown(event)}
                                onBlur={() => setEditMode(EMPTY_EDIT_MODE)}
                            /> 
                             :
                            (<label htmlFor={"edit"+ind} className={"pointer"}>{(fieldInfo.name ? fieldInfo.name : "Unnamed")}
                                        <button id={"edit"+ind} onClick={() => onEditFieldNameClick()} className={"menu--field-rename-button"}></button>
                            </label>)}
                            </span>
    
                </div>
                <div><strong>Last change: </strong>{fieldLastChange.toLocaleDateString() + ' at '+fieldLastChange.getHours()+':'+fieldLastChange.getMinutes()}</div>
    
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
