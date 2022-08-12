import ControlBar from "./control-bar/control-bar";
import {Navigate, useLocation} from "react-router-dom";
import React, {useState} from "react";
import {fetchFieldById, setField} from "../../redux/fieldSlice";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {CanvasField} from "./CanvasField/CanvasField";
import {Field} from "../../Types/Field";
import {getPatternFromServer} from "../../ServerApiHandlers/Field/GetPatternFromServer";
import {BASE_PATH} from "../../Utilities/BasePath";
import {MiniControlBar} from "./MiniControlBar/MiniControlBar";
import {SimulationHubConnectionService} from "../../Services/WebSocketConnectionService";

export const simulationHubConnectionService: SimulationHubConnectionService = new SimulationHubConnectionService();

const PlayGround: React.FC = () => {
    const location = useLocation();
    const field = useAppSelector(state => state.field.field);
    const dispatch = useAppDispatch();

    // getting field id from query
    const params = new URLSearchParams(location.search);
    
    const [isMiniMenu, setIsMiniMenu] = useState<boolean>(false);

    const inMenu = location.pathname === BASE_PATH+'/menu';
    const isPattern = location.pathname === BASE_PATH+'/pattern';
    
    if (!inMenu)
    {
        // If there is no field loaded
        if (field.id === -1) 
        {
            const fieldOrPatternIdStr = params.get('id');
            const fieldOrPatternId: number = parseInt(fieldOrPatternIdStr ?? "", 10);
            
            if (isPattern)
            {
                if (!field.survivors.length) 
                {
                    getPatternFromServer(fieldOrPatternId)
                        .then((fieldWithoutId) => {
                            const field: Field = {id: fieldOrPatternId, name: "", survivors: fieldWithoutId.survivors};
                            dispatch(setField(field))
                        });
                }
            }
            else 
            {
                // check id in query -> if there is -> fetch field from server using that id, otherwise redirect to menu
                if (fieldOrPatternId) {
                    dispatch(fetchFieldById(fieldOrPatternId)).unwrap()
                        .then((field) => {
                            dispatch(setField(field))
                        });
                } else {
                    return <Navigate to={BASE_PATH+"/menu"}/>;
                }
            }
        }
    }

    function toggleMenu()
    {
        setIsMiniMenu(x => !x);
    }
    
    console.log('isMiniMenu ->', isMiniMenu);
    return (
        <div className="flex-hor-container" style={{userSelect: 'none'}}>
            <MiniControlBar
                isMiniMenu={isMiniMenu}
                toggleMenu={toggleMenu}
            />
            <ControlBar
                isMiniMenu={isMiniMenu}
                toggleMenu={toggleMenu}
            />
            <CanvasField
                patternMode={isPattern}
                enabled={!inMenu}
            />
        </div>
    );
}

export default PlayGround;