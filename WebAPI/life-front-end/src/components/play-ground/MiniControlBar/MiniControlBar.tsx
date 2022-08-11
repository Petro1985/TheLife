import React from "react";
import './MiniControlBar.css';


export const MiniControlBar: React.FC<{isMiniMenu: boolean, toggleMenu: Function, centerView: Function}> = ({isMiniMenu, toggleMenu, centerView}) =>
{
    console.log('MiniMenu class ->', 'flex-vert-container mini-menu ' + (isMiniMenu? "" : "hidden-mini-menu"));
    
    return (
        <div className={'flex-vert-container mini-menu ' + (isMiniMenu? "" : "hidden-mini-menu")}>
            <button className={'green-button mini-menu--max-menu'} onClick={() => toggleMenu()}>{'>>>'}</button>

            <div className={'mini-menu--play'}></div>
            <div className={'mini-menu--pause'}></div>
            <div className={'mini-menu--stop'}></div>
            
            <div className={'slider-wrapper'}>
                <input type={'range'}></input>
            </div>
            
            <button className={'green-button mini-menu--center'}>C</button>
            <button className={'green-button mini-menu--menu'}>M</button>
        </div>
    );
}