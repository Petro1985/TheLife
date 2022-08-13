import './App.css';
import React, {useEffect} from 'react';
import Menu from "./components/menu/menu"
import {GetUserInfoFromServer} from "./ServerApiHandlers/GetUserInfoFromServer";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import PlayGround from "./components/play-ground/play-ground";
import {useAppDispatch} from "./Hooks/reduxHooks";
import {EDIT_MODE, MENU_MODE, PATTERN_MODE, setSimulationMode} from "./redux/playGroundSlice";
import {BASE_PATH} from "./Utilities/BasePath";

const App: React.FC = () => 
{
    useEffect(() => {            // TODO: refactor this later
        GetUserInfoFromServer()
            .then();

        // set current game mode based on location
        let newMode = MENU_MODE;
        if (location.pathname === BASE_PATH + '/field')
        {
            newMode = EDIT_MODE;
        }
        else if (location.pathname === BASE_PATH + '/pattern')
        {
            newMode = PATTERN_MODE;
        }
        dispatch(setSimulationMode(newMode));
    },[]);
    
    const dispatch = useAppDispatch();

    const location = useLocation();
    const navigate = useNavigate();
    
    console.log('Current path: ' + location.pathname);
    
    return (
        <>
            <Routes>
                <Route path={BASE_PATH+"/menu"} element={
                    <>
                        <PlayGround />
                        <Menu />
                    </>
                } />

                <Route path={BASE_PATH+"/field"} element={
                    <PlayGround />
                }/>
                <Route path={BASE_PATH+"/pattern"} element={
                    <PlayGround />
                }/>

                <Route path={BASE_PATH+"/"} element={
                    <Navigate replace to={BASE_PATH+'/menu'}></Navigate>
                }/>
            </Routes>
        </>
    )
}

export default App;