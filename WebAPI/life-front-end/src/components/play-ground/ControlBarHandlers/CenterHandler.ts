import {store} from "../../../redux/Store";
import {EDIT_MODE} from "../../../redux/playGroundSlice";
import {setCellSize, setStartCell} from "../../../redux/FieldDrawingSlice";


export function centerHandler(correctionX = 0, correctionY = 0) {
    const state = store.getState();
    const dispatch = store.dispatch;
    const fieldElement = document.getElementById('FieldWrapper');
    const canvasElement = document.getElementById('FieldCanvas');
    
    if (!(fieldElement && canvasElement)) return;

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

    const newCellSize = Math.min(
        fieldElement.clientWidth / width,
        fieldElement.clientHeight / height) * 0.7;

    // console.log('newCellSize', newCellSize);

    const cellsInRow = Math.ceil(canvasElement.clientWidth / newCellSize);
    const cellsInCol = Math.ceil(canvasElement.clientHeight / newCellSize);

    // console.log('cellsInRow', cellsInRow);
    // console.log('cellsInCol', cellsInCol);

    const cellsOffsetX = Math.ceil((canvasElement.offsetLeft + correctionX) / newCellSize);
    const cellsOffsetY = Math.ceil((canvasElement.offsetTop + correctionY) / newCellSize);

    // console.log('cellsOffsetX', cellsOffsetX);
    // console.log('cellsOffsetY', cellsOffsetY);

    dispatch(setStartCell(
        {
            x: minX + cellsOffsetX - Math.floor((cellsInRow - width) / 2.5),
            y: minY + cellsOffsetY - Math.floor((cellsInCol - height) / 4)
        }
    ));

    // console.log('new startX', minX + cellsOffsetX);
    // console.log('new startY', minY + cellsOffsetY);

    dispatch(setCellSize(newCellSize));
}