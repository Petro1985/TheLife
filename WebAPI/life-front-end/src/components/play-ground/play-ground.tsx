import ControlBar from "./control-bar/control-bar";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {fetchFieldById, setField} from "../../redux/fieldSlice";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {CanvasField} from "./CanvasField/CanvasField";
import {EDIT_MODE, MENU_MODE, setSimulationMode} from "../../redux/playGroundSlice";

const PlayGround: React.FC = () => {
    const location = useLocation();
    const field = useAppSelector(state => state.field.field);
    const dispatch = useAppDispatch();

    // getting field id from query
    const params = new URLSearchParams(location.search);

    const inMenu = location.pathname === '/menu'; 
    
    if (!inMenu)
    {
        // If there is no field loaded 
        if (field.id === -1) 
        {
            // check id in query -> if there is -> fetch field from server using that id, otherwise redirect to menu
            console.log(location.pathname);
            const fieldIdStr = params.get('id');
            const fieldId: number = parseInt(fieldIdStr ?? "", 10);
            if (fieldId) {
                dispatch(fetchFieldById(fieldId)).unwrap()
                    .then((field) => {
                        dispatch(setField(field))
                    });
            } else {
                return <Navigate to={"/menu"}/>;
            }
        }
    }

    return (
        <div className="flex-hor-container">
            <ControlBar
                enabled={!inMenu}
            />
            <CanvasField
                enabled={!inMenu}
            />
        </div>
    );
}

export default PlayGround;