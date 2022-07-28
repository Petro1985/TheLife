import React, {MouseEventHandler, useRef} from "react";
import {createNewField} from "../../redux/fieldSlice";
import {EDIT_MODE, setSimulationMode} from "../../redux/playGroundSlice";
import {useAppDispatch} from "../../Hooks/reduxHooks";
import {useNavigate} from "react-router-dom";
import {convertImportedFileToField} from "../../Utilities/ImportConvertion";
import {addPattern} from "../../redux/menuSlice";
import {PatternInfo} from "../../Types/PatternInfo";
import {AddNewPattern} from "../../ServerApiHandlers/Menu/PostAddNewPattern";
import {Pattern} from "../../Types/Pattern";


export const TopMenuButtons: React.FC<{patternButtons: boolean, onPatternClick: MouseEventHandler}> = ({onPatternClick, patternButtons}) =>
{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const inputFile = useRef<HTMLInputElement>(null)

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
    
    const onFileLoaded = (e: any) => 
    {
        e.preventDefault()
        const fileReader = new FileReader()
        fileReader.onload = async (e) => {
            if (e.target) {
                const text = (e.target.result)
                const newPatternField = convertImportedFileToField(text as string);
                console.log(newPatternField)
                const newPatternInfo: PatternInfo =
                    {
                        id: -1,
                        description: "No description yet",
                        name: "Unnamed",
                        previewBase64: "",
                        lastChange: Date.now().toString(),
                    };
                const newPattern: Pattern =
                    {
                        description: "No description yet",
                        name: "Unnamed",
                        survivors: newPatternField.survivors,
                    }
                await AddNewPattern(newPattern);
                dispatch(addPattern(newPatternInfo));
            }
        };
        fileReader.readAsText(e.target.files![0]);
    }
    
    function onAddPatternClick() {
        if (inputFile.current) 
        {
            inputFile.current.click();
        }
    }

    return (                
        <div className={"top-buttons-container"}>
            <button
                key={"Menu_NewButton"}
                onClick={() => MenuNewFieldClicked()}
                className={"green-button"}>
                New field
            </button>
            <button
                key={"Menu_PatternButton"}
                onClick={onPatternClick}
                className={"green-button"}>
                {patternButtons ? `My fields` : `Patterns`}
            </button>
            {patternButtons &&
                <button
                    key={"Menu_PatternImportButton"}
                    onClick={onAddPatternClick}
                    className={"green-button"}>
                    {`Import pattern`}
                </button>
            }

            <input 
                onChange={onFileLoaded}
                type='file' 
                id='file' 
                ref={inputFile}
                style={{display: 'none'}}
            />
        </div>
    )
}



// {/*<div>*/}
// {/*    <button*/}
// {/*        onClick={() =>*/}
// {/*        {*/}
// {/*            fetch('exampleTxt.txt')*/}
// {/*                .then(t => t.text()).then(text => {*/}
// {/*                console.log('you text', text)*/}
// {/*            })*/}
// {/*        }}*/}
// {/*    >!Import field!</button>*/}
// {/*    <input type={'file'}*/}
// {/*        onChange={(e) =>*/}
// {/*        {*/}
// {/*            e.preventDefault()*/}
// {/*            const exampleFileReader = new FileReader()*/}
// {/*            exampleFileReader.onload = async (e) => {*/}
// {/*                if (e.target) {*/}
// {/*                    const text = (e.target.result)*/}
// {/*                    console.log(text)*/}
// {/*                    const newField = convertImportedFileToField(text as string);*/}
// {/*                    dispatch(createNewField()).unwrap().then((field) => {*/}
// {/*                        if (field)*/}
// {/*                        {*/}
// {/*                            dispatch(setField({id: field.id, name: field.name, survivors: newField.survivors}))*/}
// {/*                            dispatch(updateFieldOnServer());*/}
// {/*                            navigate('/field?id='+field.id);*/}
// {/*                        }*/}
// {/*                    });*/}
// {/*                }*/}
// {/*            };*/}
// {/*            exampleFileReader.readAsText(e.target.files![0]);*/}
// {/*        }}*/}
// {/*    ></input>*/}
// {/*</div>*/}

