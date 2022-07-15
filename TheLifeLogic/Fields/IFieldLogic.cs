using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Fields;

public interface IFieldLogic
{
    public bool IsAlive(Coord coord);
    public void SetCell(Coord coord, bool state);
    public void SetState(Field lState);
    public Field GetField();
    public List<Coord> GetSurvivors();
    public Field GetSquareState(Rect rect);
    public int GetAliveNeighborsCount(Coord coord);
    public IFieldLogic Clone();
}

