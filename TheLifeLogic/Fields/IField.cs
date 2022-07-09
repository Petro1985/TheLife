using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Fields;

public interface IField
{
    public bool IsAlive(Coord coord);
    public void SetCell(Coord coord, bool state);

    public void SetState(Field lState);
    public Field GetState();

    public Field GetSquareState(Rect rect);
    public int GetAliveNeighborsCount(Coord coord);

    public IField Clone();
}