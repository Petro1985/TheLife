import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../Hooks/reduxHooks";
import {fetchPatternsInfo} from "../../redux/menuSlice";

export const PatternsElement: React.FC = () =>
{
    const dispatch = useAppDispatch();
    
    const patterns = useAppSelector(state => state.menu.patterns);
       
    useEffect(() => 
    {
        dispatch(fetchPatternsInfo());        
    }, []);

    function onPatternClickHandler(e: React.MouseEvent<HTMLDivElement>, ind: number) {
//        dispatch(getPatternFromServer(patterns[ind].id));
        
    }

    const patternItems = patterns.map((pattern, ind) =>
    {
        return (
            <div 
                id={'pattern'+pattern.id}
                className={`patterns--item`}
                onClick={(e) => onPatternClickHandler(e, ind)}
            >
                <div className={'flex-hor-container'}>
                    <img src={'data:image/png;base64,' + pattern.previewBase64} alt={'pattern'} className={'pattern--image'}/>
                    <div className={'flex-vert-container'}>
                        <h3>{pattern.name}</h3>
                        <h3>Desription:</h3>
                        <p>{pattern.description}</p>
                    </div>
                </div>
                <></>
            </div>);
    });
    
    
    return (
        <div className={`patterns`}>
            <div className={`patterns-container`}>
                {patternItems}
            </div>
        </div>);
}

