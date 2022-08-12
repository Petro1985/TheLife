import {store} from "../../../redux/Store";
import {EDIT_MODE} from "../../../redux/playGroundSlice";


export function centerHandler() {
    const state = store.getState()

    let field;
    if (state.playGround.mode === EDIT_MODE)
    {
        field = state.playGround.simulatedField.field.survivors;
    }
    else
    {
        field = state.field.field.survivors;
    }
    
    if (!field.length) return;

    let maxX: number = field[0].x;
    let minX: number = field[0].x;
    let maxY: number = field[0].y;
    let minY: number = field[0].y;

    field.forEach(x => {
        if (minX > x.x) {
            minX = x.x;
        }
        if (minY > x.y) {
            minY = x.y;
        }
        if (maxX < x.x) {
            maxX = x.x;
        }
        if (maxY < x.y) {
            maxY = x.y;
        }
    });
    // console.log('minX', minX);
    // console.log('minY', minY);
    // console.log('maxX', maxX);
    // console.log('maxY', maxY);

    const width = maxX - minX;
    const height = maxY - minY;

    // console.log('width',width);
    // console.log('height',height);

    // const newCellSize = Math.min(
    //     fieldElement.current!.clientWidth / width,
    //     fieldElement.current!.clientHeight / height) * 0.7;
    //
    // // console.log('newCellSize', newCellSize);
    //
    // const cellsInRow = Math.ceil(canvasElement.current!.clientWidth / newCellSize);
    // const cellsInCol = Math.ceil(canvasElement.current!.clientHeight / newCellSize);
    //
    // // console.log('cellsInRow', cellsInRow);
    // // console.log('cellsInCol', cellsInCol);
    //
    // const cellsOffsetX = Math.ceil(canvasElement.current!.offsetLeft / newCellSize);
    // const cellsOffsetY = Math.ceil(canvasElement.current!.offsetTop / newCellSize);
    //
    // // console.log('cellsOffsetX', cellsOffsetX);
    // // console.log('cellsOffsetY', cellsOffsetY);
    //
    // setStartCellX(minX + cellsOffsetX - Math.floor((cellsInRow - width) / 2.5));
    // setStartCellY(minY + cellsOffsetY - Math.floor((cellsInCol-height) / 4));
    //
    // // console.log('new startX', minX + cellsOffsetX);
    // // console.log('new startY', minY + cellsOffsetY);
    //
    // setCellSize(newCellSize);
}