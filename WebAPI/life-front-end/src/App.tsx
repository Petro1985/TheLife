import './App.css';
import React, {useEffect} from 'react';
import Menu from "./components/menu/menu"
import {GetUserInfoFromServer} from "./ServerApiHandlers/GetUserInfoFromServer";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import PlayGround from "./components/play-ground/play-ground";
import {useAppDispatch} from "./Hooks/reduxHooks";
import {EDIT_MODE, MENU_MODE, setIntervalId, setSimulationMode} from "./redux/playGroundSlice";
import {store} from "./redux/Store";
import {simulationHubConnectionService} from "./components/play-ground/control-bar/control-bar";

const App: React.FC = () => 
{
    useEffect(() => {            // TODO: refactor this later
        GetUserInfoFromServer()
            .then();
        
        // set current game mode based on location
        dispatch(setSimulationMode(location.pathname === '/menu' ? MENU_MODE : EDIT_MODE));
    },[]);
    
    const dispatch = useAppDispatch();

    const location = useLocation();
    const navigate = useNavigate();
    
    // window.onkeydown = (e) => {
    //     if (e.key === 'Escape')
    //     {
    //         switch (location.pathname) 
    //         {
    //             case '/menu':
    //                 dispatch(setSimulationMode(EDIT_MODE));
    //                 navigate('/field')
    //                 break;
    //             case '/field':
    //                 // close connection and clear intervals if simulation was in progress
    //
    //
    //                 dispatch(setSimulationMode(MENU_MODE));
    //                 navigate('/menu')
    //                 break;
    //             default:
    //                 navigate('/menu')
    //                 break;
    //         }
    //     }
    // } 
    return (
        <>
            <Routes>
                <Route path={"/menu"} element={
                    <>
                        <PlayGround />
                        <Menu />
                    </>
                } />

                <Route path={"/field"} element={
                    <PlayGround />
                }/>
                <Route path={"/pattern"} element={
                    <PlayGround />
                }/>

                <Route path={"/"} element={
                    <Navigate replace to={"/menu"}></Navigate>
                }/>
            </Routes>
        </>
    )
}

export default App;