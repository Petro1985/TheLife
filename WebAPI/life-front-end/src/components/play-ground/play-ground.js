import ControlBar from "./control-bar/control-bar";
import Field from "./field/field";
import {Navigate, useLocation} from "react-router-dom";
import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchFieldById} from "../../redux/fieldSlice";



export default function PlayGround(props) 
{   
    const location = useLocation();
    const field = useSelector( state => state.field.field);
    const dispatch = useDispatch();
    
    const [currentMode, setCurrentMode] = useState({state:"EDIT_MODE"});

    // getting field id from query
    const params = new URLSearchParams(location.search);
    const fieldId = params.get('id');
    
    // If there is no field loaded 
    if (field.id === -1) {
        // check id in query -> if there is -> fetch field from server using that id, otherwise redirect to menu
        if (fieldId)
        {
            dispatch(fetchFieldById(fieldId));
        }
        else
        {
            return <Navigate to={"/menu"}/>;
        }
    }
    
    return (
        <div className="flex-container">
            <ControlBar
            />
            <Field
                mode={currentMode}
            />
        </div>
    );
}
