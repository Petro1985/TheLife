namespace TheLiveLogic;

public interface IMap
{
    public bool IsAlive(int x, int y);
    public void SetCell(int x, int y, bool state);

    public void SetState(LifeState lState);
    public LifeState GetState();

    public int GetAliveNeighborsCount(int x, int y);

    public IMap Clone();
}