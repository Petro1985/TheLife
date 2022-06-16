import React from 'react' 
import './field.css'

export default function Field(props) {
    const Cells = [];
    const life = props.Survivors;

    for (let i = 0; i < 100; i++)
    {
        if (
            life.find(element => element.x === i % 10 && element.y === Math.floor(i / 10))
        ){
            Cells.push(<div key={i} className={"alive-cell"}></div>);
        }
        else
        {
            Cells.push(<div key={i} className={"dead-cell"}></div>);
        }
    }
    return <div className={"map"}>{Cells}</div>;
}


