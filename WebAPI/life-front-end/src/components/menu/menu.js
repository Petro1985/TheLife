import React, {useEffect, useState} from "react";
import "./menu.css";

export default function Menu(props)
{
    const fetchService = props.fetchService;
    const mapService = props.mapService;
    
    const [mapsInfo, setMapsInfo] = useState([])
    
    
    async function MenuButtonClicked(number) {
        if (number > -1) 
        {        
            const map = await fetchService.GetMap(mapsInfo[number].id);
            mapService.SetNewMap(map);
            // console.log("--------new map set---------");
            // console.log(map);
        }
        props.AppStateSetter(oldState => oldState + 1);
    }

    useEffect(() => {
            async function fetchData() {
                const mapsInfo = await fetchService.GetAllMapsInfo();
                // console.log("---------mapsInfo---------------------");
                // console.log(mapsInfo);                
                setMapsInfo(mapsInfo);
            }
            fetchData();
        }, []
    )
    
    const maps = mapsInfo.map((mapInfo, ind) => 
    {
        return (
            <div key={"MenuContainer" + mapInfo.id} className={"menu--item-container"}>
                <img 
                    key={"MenuImg" + mapInfo.id}
                    className={"menu--button-image"}
                    src={'data:image/png;base64,' + mapInfo.minimapBase64}
                    alt={"Minimap"} />
                
                <button
                    onClick={() => MenuButtonClicked(ind)}
                    key={"MenuButton" + mapInfo.id}
                    className={"green-button"}>
                    {mapInfo.name ? mapInfo.name : "Unnamed"}
                </button>
            </div>
        );
    });
    

    return (
        <div className={"menu"}>
            <button key={"MenuEmptyButton"} onClick={() => MenuButtonClicked(-1)} className={"green-button"}>Empty map</button>
            {maps}
        </div>);
}
