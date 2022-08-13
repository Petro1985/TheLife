import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {fetchPatternsInfo} from "../../redux/menuSlice";
import {useNavigate} from "react-router-dom";
import {EDIT_MODE, PATTERN_MODE, setSimulationMode} from "../../redux/playGroundSlice";
import {getPatternFromServer} from "../../ServerApiHandlers/Field/GetPatternFromServer";
import {Field} from "../../Types/Field";
import {setField} from "../../redux/fieldSlice";
import {BASE_PATH} from "../../Utilities/BasePath";

export const PatternsElement: React.FC = () =>
{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const patterns = useAppSelector(state => state.menu.patterns);
       
    useEffect(() => 
    {
        dispatch(fetchPatternsInfo());        
    }, []);

    async function onPatternClickHandler(e: React.MouseEvent<HTMLDivElement>, ind: number) {
        const fieldWithoutId = await getPatternFromServer(patterns[ind].id);
        const field:Field = {id: patterns[ind].id, name:'', survivors: fieldWithoutId.survivors};
        dispatch(setField(field));
        dispatch(setSimulationMode(PATTERN_MODE));
        navigate(BASE_PATH+'/pattern?id=' + field.id);
    }

    const patternItems = patterns.map((pattern, ind) =>
    {
        return (
            <div 
                key={'pattern'+ind}
                className={`patterns--item`}
                onClick={(e) => onPatternClickHandler(e, ind)}
            >
                <div 
                    className={'flex-hor-container'}
                >
                    <img src={'data:image/png;base64,' + pattern.previewBase64} alt={'pattern'} className={'pattern--image'}/>
                    <div
                        className={'flex-vert-container'}
                    >
                        <h3>{pattern.name}</h3>
                        <h3>Desription:</h3>
                        <p>{pattern.description}</p>
                    </div>
                </div>
            </div>);
    });
    
    
    return (
        <div className={`patterns`}>
            <div className={`patterns-container`}>
                {patternItems}
            </div>
        </div>);
}

