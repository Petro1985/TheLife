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

    function centerView() {
    //     if (!field.length) return;
    //
    //     let maxX: number = field[0].x;
    //     let minX: number = field[0].x;
    //     let maxY: number = field[0].y;
    //     let minY: number = field[0].y;
    //
    //     field.forEach(x => {
    //         if (minX > x.x) {
    //             minX = x.x;
    //         }
    //         if (minY > x.y) {
    //             minY = x.y;
    //         }
    //         if (maxX < x.x) {
    //             maxX = x.x;
    //         }
    //         if (maxY < x.y) {
    //             maxY = x.y;
    //         }
    //     });
    //     // console.log('minX', minX);
    //     // console.log('minY', minY);
    //     // console.log('maxX', maxX);
    //     // console.log('maxY', maxY);
    //
    //     const width = maxX - minX;
    //     const height = maxY - minY;
    //
    //     // console.log('width',width);
    //     // console.log('height',height);
    //
    //     const newCellSize = Math.min(
    //         fieldElement.current!.clientWidth / width,
    //         fieldElement.current!.clientHeight / height) * 0.7;
    //
    //     // console.log('newCellSize', newCellSize);
    //
    //     const cellsInRow = Math.ceil(canvasElement.current!.clientWidth / newCellSize);
    //     const cellsInCol = Math.ceil(canvasElement.current!.clientHeight / newCellSize);
    //
    //     // console.log('cellsInRow', cellsInRow);
    //     // console.log('cellsInCol', cellsInCol);
    //
    //     const cellsOffsetX = Math.ceil(canvasElement.current!.offsetLeft / newCellSize);
    //     const cellsOffsetY = Math.ceil(canvasElement.current!.offsetTop / newCellSize);
    //
    //     // console.log('cellsOffsetX', cellsOffsetX);
    //     // console.log('cellsOffsetY', cellsOffsetY);
    //
    //     setStartCellX(minX + cellsOffsetX - Math.floor((cellsInRow - width) / 2.5));
    //     setStartCellY(minY + cellsOffsetY - Math.floor((cellsInCol-height) / 4));
    //
    //     // console.log('new startX', minX + cellsOffsetX);
    //     // console.log('new startY', minY + cellsOffsetY);
    //
    //     setCellSize(newCellSize);
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
                centerView={centerView}
                toggleMenu={toggleMenu}
            />
            <ControlBar
                isMiniMenu={isMiniMenu}
                centerView={centerView}
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