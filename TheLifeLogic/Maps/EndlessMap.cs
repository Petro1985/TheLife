namespace TheLiveLogic.Maps;

public class EndlessMap : IMap
{
    private readonly HashSet<Coord> _map;

    public EndlessMap()
    {
        _map = new HashSet<Coord>();
    }
    
    private EndlessMap(HashSet<Coord> map)
    {
        _map = new HashSet<Coord>(map);
    }
    
    public bool IsAlive(Coord coord)
        => _map.Contains(coord);

    public void SetCell(Coord coord, bool state)
    {
        if (state)
        {
            _map.Add(coord);
        }
        else
        {
            _map.Remove(coord);
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

    public LifeState GetSquareState(Rect rect)
    {
        var result = _map.Where(lifeCoord => lifeCoord.InBox(rect)).ToList();
        return new LifeState(result);
    }
    
    public int GetAliveNeighborsCount(Coord coord)
    {
        var neighbors = coord.GetNeighbors();
        return neighbors.Count(IsAlive);
    }

    public IMap Clone()
    {
        return new EndlessMap(_map);
    }
}