namespace TheLiveLogic;

public class Map : IMap
{
    private readonly bool[,] _map;

    public Map(int size)
    {
        _map = new bool[size, size];
    }

    public bool IsAlive(int x, int y)
    {
        if (x >= _map.GetLength(0) || y >= _map.GetLength(1)) return false;
        return _map[x, y];
    }

    public void SetState(int x, int y, bool state)
    {
        _map[x, y] = state;
    }

    public void SetState(LifeState lState)
    {
        throw new NotImplementedException();
    }

    public LifeState GetState()
    {
        throw new NotImplementedException();
    }

    public int GetAliveNeighborsCount(int x, int y)
    {
        var neighbors = (x, y).GetNeighbors();
        
        return neighbors.Count(neighbor => IsAlive(neighbor.x, neighbor.y));
    }

    public IMap Clone()
    {
        var newMap = new Map(_map.GetLength(0));
        Array.Copy(_map, newMap._map, _map.Length);
        return newMap;
    }
}