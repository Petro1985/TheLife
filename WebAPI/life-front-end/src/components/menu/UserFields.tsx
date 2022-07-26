import React, {useState} from "react";
import {useAppSelector} from "../../Hooks/reduxHooks";
import MenuItem from "./MenuItem";


export const UserFields: React.FC = () =>
{
    const [topField, setTopField] = useState(0);
    const fieldsInfo = useAppSelector(state => state.menu.fields);

    const fields = fieldsInfo.map((mapInfo, ind) =>
    {
        return (
            <MenuItem
                key={"MenuItem"+ind}
                ind = {ind}
            />
        );
    }).slice(topField,topField + 3);
    
    return (
    <div
        className={"menu"}
    >

        <div
            onClick={() => {setTopField(x => x - 1)}}
            className={"menu--arrow-up"}
            style={{visibility: topField ? "visible" : "hidden"}}>
        </div>

        {fields}

        <div
            onClick={() => {setTopField(x => x + 1)}}
            className={"menu--arrow-down"}
            style={{visibility: (topField + 3 < fieldsInfo.length) ? "visible" : "hidden"}}
        >
        </div>
    </div>);
}