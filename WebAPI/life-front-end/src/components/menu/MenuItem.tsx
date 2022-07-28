import React, {useEffect, useRef, useState} from "react";
import {fetchFieldById} from "../../redux/fieldSlice";
import {deleteItem, renameField} from "../../redux/menuSlice";
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {EDIT_MODE, setSimulationMode} from "../../redux/playGroundSlice";
import {DeleteFieldOnServer} from "../../ServerApiHandlers/Field/DeleteFieldOnServer";

type Props = {
    ind: number,
}

type EditMode = {
    active: boolean,
    editedFieldId: number,
    editedName: string
}

const MenuItem: React.FC<Props> = function ({ind}) 
{
    const EMPTY_EDIT_MODE: EditMode = {active:false, editedName: "", editedFieldId: 0};
    
    const [editMode, setEditMode] = useState<EditMode>(EMPTY_EDIT_MODE)
    
    const dispatch = useAppDispatch();
    
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    
    const fieldInfo = useAppSelector(state => state.menu.fields[ind]);
    const fieldLastChange = new Date(fieldInfo.lastChange);

    function onEditFieldNameClick()
    {
        setEditMode({active: true, editedFieldId: ind, editedName: fieldInfo.name});
    }

    function onFieldNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEditMode(old => {
                const newValue = {...old};
                newValue.editedName = event.target.value;
                return newValue;
            }
        );
    }
    async function MenuButtonClicked() {
        dispatch(fetchFieldById(fieldInfo.id)).unwrap()
            .then((_) => 
            {
                dispatch(setSimulationMode(EDIT_MODE));
                navigate('/field?id=' + fieldInfo.id);
            });
    }

    async function OnDeleteFieldClicked(ind: number) {
        await DeleteFieldOnServer(fieldInfo.id);
        dispatch(deleteItem(ind));
    }
    
    // effect for focusing input
    useEffect(() => {
        if (editMode.active) {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [editMode])

    function onFieldNameInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFieldNameInputChange(event)}
                                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => onFieldNameInputKeyDown(event)}
                                onBlur={() => setEditMode(EMPTY_EDIT_MODE)}
                            /> 
                             :
                            (<label htmlFor={"edit"+ind} className={"pointer"}>{(fieldInfo.name ? fieldInfo.name : "Unnamed")}
                                        <button id={"edit"+ind} onClick={() => onEditFieldNameClick()} className={"menu--field-rename-button"}></button>
                            </label>)}
                            </span>
    
                </div>
                <div><strong>Last change: </strong>
                    {fieldLastChange.toLocaleDateString() 
                        + ' at ' + fieldLastChange.getHours() + ':' + fieldLastChange.getMinutes()}
                </div>
    
                <div className={"menu--field--choose-delete-buttons"}>
                    <button
                        onClick={() => MenuButtonClicked()}
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

export default MenuItem;