namespace TheLiveLogic.Maps;

public interface IMap
{
    public bool IsAlive(Coord coord);
    public void SetCell(Coord coord, bool state);

    public void SetState(LifeState lState);
    public LifeState GetState();

    public LifeState GetSquareState(Rect rect);
    public int GetAliveNeighborsCount(Coord coord);

    public IMap Clone();
}