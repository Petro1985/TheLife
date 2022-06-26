import React from 'react' 
import './field.css'

export default function Field(props) {
    const Cells = [];
    const mapService = props.mapService;
    const fetchService = props.fetchService;
    
    const life = props.mapService.currentMap.survivors;
        
    async function ChangeLife(x, y)
    {
        mapService.ChangeLife(x, y);
        mapService.ApplyCurrentMap();
        mapService.currentMap.id = await fetchService.SetMap(mapService.currentMap);        
    }
    
    for (let j = 0; j < 10; j++)
    {
        const row = [];
        for (let i = 0; i < 10; i++)
        {
            
            if (
                life.find(element => element.x === i && element.y === j)
            ){
                row.push(<div onClick={() => ChangeLife(i, j)} key={i + j * 10} className={"alive-cell"}></div>);
            }
            else
            {
                row.push(<div onClick={() => ChangeLife(i, j)} key={i + j * 10} className={"dead-cell"}></div>);
            }
        }
        Cells.push(<div key={"FieldRow" + j} className={"row"}>{row}</div>)

    }
    
    return <div className={"field"}>{Cells}</div>;
}

