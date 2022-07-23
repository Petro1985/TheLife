import ControlBar from "./control-bar/control-bar";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {fetchFieldById, setField} from "../../redux/fieldSlice";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {CanvasField} from "./CanvasField/CanvasField";

const PlayGround: React.FC = () =>  
{   
    const location = useLocation();
    const field = useAppSelector( state => state.field.field);
    const dispatch = useAppDispatch();
    
    // getting field id from query
    const params = new URLSearchParams(location.search);
    
    const fieldIdStr = params.get('id');
    const fieldId: number = parseInt(fieldIdStr!, 10);      // ToDo: need to get rid of '!'
    
    // If there is no field loaded 
    if (field.id === -1) {
        // check id in query -> if there is -> fetch field from server using that id, otherwise redirect to menu
        if (fieldId)
        {
            dispatch(fetchFieldById(fieldId)).unwrap()
                .then((field) => {
                    dispatch(setField(field))
                });
        }
        else
        {
            return <Navigate to={"/menu"}/>;
        }
    }
    
    return (
        <div className="flex-container">
            <ControlBar/>
            <CanvasField/>
        </div>
    );
}

export default PlayGround;