import React from "react";
import "./menu.css";

export default function Menu(props)
{

    function MenuButtonClicked(number) 
    {
        props.AppStateSetter(oldState => oldState + 1);     //may be I should think about it
    }    

    return (
        <div className={"menu"}>
            <button onClick={() => MenuButtonClicked(1)} className={"green-button"}>Empty map</button>
            <button className={"green-button"}>Template 1</button>
            <button className={"green-button"}>Template 2</button>
            <button className={"green-button"}>Template 3</button>
            <button className={"green-button"}>Template 4</button>
            <button className={"green-button"}>Template 5</button>
        </div>);
}
