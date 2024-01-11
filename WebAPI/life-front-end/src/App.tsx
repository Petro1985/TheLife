import './App.css';
import React, {useEffect} from 'react';
import Menu from "./components/menu/menu"
import {GetUserInfoFromServer} from "./ServerApiHandlers/GetUserInfoFromServer";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import PlayGround from "./components/play-ground/play-ground";
import {useAppDispatch} from "./Hooks/reduxHooks";
import {EDIT_MODE, MENU_MODE, PATTERN_MODE, setSimulationMode} from "./redux/playGroundSlice";
import {BASE_PATH} from "./Utilities/BasePath";
import {SERVER_ADDRESS} from "./Utilities/serverAddress";
import {AuthProvider, AuthProviderProps} from "react-oidc-context";
import {IDENTITY_CLIENT_ID, IDENTITY_CLIENT_SECRET, IDENTITY_SERVER_ADDRESS} from "./Utilities/IdentityServer";

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

        console.log('BasePath -> ', BASE_PATH);
        console.log('ServerAddress -> ', SERVER_ADDRESS);
    },[]);

    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Env:', process.env);
    
    const dispatch = useAppDispatch();
    const location = useLocation();
    
    console.log('Current path: ' + location.pathname);

    const oidcConfig: AuthProviderProps = {
        authority: IDENTITY_SERVER_ADDRESS,
        client_id: IDENTITY_CLIENT_ID,
        client_secret: IDENTITY_CLIENT_SECRET,
        redirect_uri: "http://localhost:44447/life/menu",
        scope: "api1",
    };
    
    return (
        <AuthProvider {...oidcConfig}>
            
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
        </AuthProvider>
    )
}

export default App;