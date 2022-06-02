namespace TheLiveLogic.Maps;

public class EndlessMap : IMap
{
    private readonly HashSet<(int, int)> _map;

    public EndlessMap()
    {
        _map = new HashSet<(int, int)>();
    }
    
    private EndlessMap(HashSet<(int, int)> map)
    {
        _map = new HashSet<(int, int)>(map);
    }
    
    public bool IsAlive(int x, int y)
        => _map.Contains((x, y));

    public void SetCell(int x, int y, bool state)
    {
        if (state)
        {
            _map.Add((x, y));
        }
        else
        {
            _map.Remove((x, y));
        }
    }

    public void SetState(LifeState lState)
    {
        _map.Clear();
        _map.UnionWith(lState.Survivors);
    }

    public LifeState GetState()
    {
        return new LifeState(_map.ToArray());
    }

    public int GetAliveNeighborsCount(int x, int y)
    {
        var neighbors = (x, y).GetNeighbors();
        
        return neighbors.Count(neighbor => IsAlive(neighbor.x, neighbor.y));
    }

    public IMap Clone()
    {
        return new EndlessMap(_map);
    }
}