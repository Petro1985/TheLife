import './App.css';
import React, {useEffect, useState} from 'react';
import Menu from "./components/menu/menu"
import {logDOM} from "@testing-library/react";
import {GetUserInfoFromServer} from "./ServerApiHandlers/GetUserInfoFromServer";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import PlayGround from "./components/play-ground/play-ground";

function App() {
    useEffect(() => {            // TODO: refactor this later
        GetUserInfoFromServer()
            .then();
    },[]);

    const location = useLocation();
    const navigate = useNavigate();
    
    window.onkeydown = (e) => {
        if (e.key === 'Escape')
        {
            switch (location.pathname) 
            {
                case '/menu':
                    navigate('/field')
                    break;
                case '/field':
                    navigate('/menu')
                    break;
                default:
                    navigate('/menu')
                    break;
            }
        }
    } 
    return (
        <>
            <Routes>
                <Route path={"/menu"} element={<Menu/>} />

                <Route path={"/field"} element={
                        <PlayGround />
                }/>

                <Route path={"/"} element={<Navigate replace to={"/menu"}></Navigate>}/>
            </Routes>
        </>
    )
}

export default App;