import React from 'react' 
import './field.css'
import { useDispatch, useSelector } from "react-redux";
import {changeField, setFieldId} from "../../redux/Actions";
import updateFieldOnServer from "../../Utilities/UpdateFieldOnServer";

export default function Field(props) {
    const Cells = [];
    const dispatch = useDispatch();

    
    const { field } = useSelector( state => {
        const {field} = state.fieldReducer;
        return {field} ;
    });
    
    async function changeCell(coord) {
        dispatch(changeField(coord));
        await updateFieldOnServer(field);
    }    
    
    for (let j = 0; j < 10; j++)
    {
        const row = [];
        for (let i = 0; i < 10; i++)
        {
            
            if (
                field.survivors.find(element => element.x === i && element.y === j)
            ){
                row.push(<div onClick={() => changeCell({x:i, y:j})} key={i + j * 10} className={"alive-cell"}></div>);
            }
            else
            {
                row.push(<div onClick={() => changeCell({x:i, y:j})} key={i + j * 10} className={"dead-cell"}></div>);
            }
        }
        Cells.push(<div key={"FieldRow" + j} className={"row"}>{row}</div>)

    }
    
    return <div className={"field"}>{Cells}</div>;
}
