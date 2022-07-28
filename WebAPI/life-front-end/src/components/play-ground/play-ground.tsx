import ControlBar from "./control-bar/control-bar";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {fetchFieldById, setField, setFieldFromPattern} from "../../redux/fieldSlice";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {CanvasField} from "./CanvasField/CanvasField";
import {getPatternFromServer} from "../../ServerApiHandlers/Field/GetPatternFromServer";
import {Field} from "../../Types/Field";

const PlayGround: React.FC = () => {
    const location = useLocation();
    const field = useAppSelector(state => state.field.field);
    const dispatch = useAppDispatch();

    // getting field id from query
    const params = new URLSearchParams(location.search);

    const inMenu = location.pathname === '/menu';
    const isPattern = location.pathname === '/pattern';
    
    if (!inMenu)
    {
        // If there is no field loaded
        if (field.id === -1) 
        {
            const fieldOrPatternIdStr = params.get('id');
            const fieldOrPatternId: number = parseInt(fieldOrPatternIdStr ?? "", 10);
            if (isPattern)
            {
                dispatch(setFieldFromPattern(fieldOrPatternId)).unwrap()
                    .then((fieldWithoutId) => {
                        const field: Field = {id:fieldOrPatternId, name: "", survivors: fieldWithoutId.survivors}; 
                        dispatch(setField(field))
                    });
            }
            else 
            {
                // check id in query -> if there is -> fetch field from server using that id, otherwise redirect to menu
                if (fieldOrPatternId) {
                    dispatch(fetchFieldById(fieldOrPatternId)).unwrap()
                        .then((field) => {
                            dispatch(setField(field))
                        });
                } else {
                    return <Navigate to={"/menu"}/>;
                }
            }
        }
    }
    
    return (
        <div className="flex-hor-container">
            <ControlBar
                enabled={!inMenu}
            />
            <CanvasField
                patternMode={isPattern}
                enabled={!inMenu}
            />
        </div>
    );
}

export default PlayGround;