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

    const patternItems = patterns.map(pattern =>
    {
        return (
            <div id={'pattern'+pattern.id} className={`patterns--item`}>
                <div className={'flex-hor-container'}>
                    <img src={''} alt={'pattern'} className={'pattern--image'}/>
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
        <div className={`patterns-container`}>
            {patternItems}
        </div>);
}

