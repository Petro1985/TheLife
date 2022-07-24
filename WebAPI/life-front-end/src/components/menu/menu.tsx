import React, {useEffect, useRef, useState} from "react";
import "./menu.css";
import MenuItem from "./MenuItem";
import {createNewField, setField, updateFieldOnServer} from "../../redux/fieldSlice";
import {fetchFieldsInfo} from "../../redux/menuSlice";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {convertImportedFileToField} from "../../Utilities/ImportConvertion";
import {EDIT_MODE, setSimulationMode} from "../../redux/playGroundSlice";

const Menu: React.FC = () => 
{
    const fieldsInfo = useAppSelector(state => state.menu.menu);
    const dispatch = useAppDispatch();

    const [topField, setTopField] = useState(0);
    const [isPatternShown, setIsPatternShown] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<{left:string, width: number}>({left: `calc(50vw - 225px)`, width: 450});
    
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
                dispatch(setSimulationMode(EDIT_MODE));
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
            className={`menu-container`}
            style={menuPosition}
        >
            <div 
                className={"menu"}
                ref={menuElement}
            >
                <div>
                    <button 
                        key={"Menu_NewButton"}
                        onClick={() => MenuNewFieldClicked()}
                        className={"green-button"}>
                        New field
                    </button>
                    <button
                        key={"Menu_PatternButton"}
                        onClick={() => 
                        {
                            setIsPatternShown(prev => !prev)
                            if (isPatternShown)
                            {
                                setMenuPosition({left: `calc(50vw - 225px)`, width: 450})
                            }
                            else
                            {
                                setMenuPosition({left: `calc(50vw - 475px)`,width:950})
                            }
                        }}
                        className={"green-button"}>
                        {`Patterns =>`}
                    </button>
                </div>
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
                
                <div>
                    <button
                        onClick={() =>
                        {
                            fetch('exampleTxt.txt')
                                .then(t => t.text()).then(text => {
                                console.log('you text', text)
                            })
                        }}
                    >!Import field!</button>
                    <input type={'file'}
                        onChange={(e) =>
                        {
                            e.preventDefault()
                            const exampleFileReader = new FileReader()
                            exampleFileReader.onload = async (e) => {
                                if (e.target) {
                                    const text = (e.target.result)
                                    console.log(text)
                                    const newField = convertImportedFileToField(text as string);
                                    dispatch(createNewField()).unwrap().then((field) => {
                                        if (field)
                                        {
                                            dispatch(setField({id: field.id, name: field.name, survivors: newField.survivors}))
                                            dispatch(updateFieldOnServer());
                                            navigate('/field?id='+field.id);
                                        }
                                    });
                                }
                            };
                            exampleFileReader.readAsText(e.target.files![0]);
                        }}
                    ></input>
                </div>

            </div>
            {
                isPatternShown && 
                <div className={`patterns`}>
                
                </div>
            }       
        </div>
            );
}

export default Menu;