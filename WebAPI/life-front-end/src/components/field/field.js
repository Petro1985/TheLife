import React from 'react' 
import './field.css'

export default function Field(props) {
    const Cells = [];
    const life = props.Survivors.survivors;
    // console.log("-----LIFE in field-------");
    // console.log(props);

    async function ChangeLife(x, y) {
        const setter = props.setField;
        
        console.log(props);
        setter(prevField => {
            // console.log("-----------------Prev field--------------");
            // console.log(prevField)
            const newField = {}
            newField.id = prevField.id;
            
            newField.survivors = prevField.survivors.filter(life => !(life.x === x && life.y === y));

            // console.log("-----------------new field--------------");
            // console.log(prevField)
            
            if (newField.survivors.length === prevField.survivors.length)
            {
                newField.survivors.push({x:x, y:y});
            }
            
            return newField;
        });
        // await fetch('https://localhost:7129/Map', fetchOptions)
        //     .then(response => response.json())
        //     .then(data => {
        //         setSurvivors(data[0].survivors);
        //     })
        //     .catch(e => console.log(e));
    }
    
    for (let i = 0; i < 10; i++)
    {
        const row = [];
        for (let j = 0; j < 10; j++)
        {
            if (
                life.find(element => element.x === i && element.y === j)
            ){
                row.push(<div onClick={() => ChangeLife(i, j)} key={i+j*10} className={"alive-cell"}></div>);
            }
            else
            {
                row.push(<div onClick={() => ChangeLife(i, j)} key={i+j*10} className={"dead-cell"}></div>);
            }
        }
        Cells.push(<div key={"FieldRow"+i} className={"row"}>{row}</div>)        
    }
    
    return <div className={"map"}>{Cells}</div>;
}


