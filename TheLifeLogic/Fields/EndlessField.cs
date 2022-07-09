using TheLiveLogic.ExtensionMethods;

namespace TheLiveLogic.Fields;

public class EndlessField : IField
{
    private readonly HashSet<Coord> _map;

    public EndlessField()
    {
        _map = new HashSet<Coord>();
    }
    
    private EndlessField(HashSet<Coord> map)
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

    public void SetState(DataStruct.Field lState)
    {
        _map.Clear();
        _map.UnionWith(lState.Survivors);
    }

    public DataStruct.Field GetState()
    {
        return new DataStruct.Field(_map.ToList());
    }

    public DataStruct.Field GetSquareState(Rect rect)
    {
        var result = _map.Where(lifeCoord => lifeCoord.InBox(rect)).ToList();
        return new DataStruct.Field(result);
    }
    
    public int GetAliveNeighborsCount(Coord coord)
    {
        var neighbors = coord.GetNeighbors();
        return neighbors.Count(IsAlive);
    }

    public IField Clone()
    {
        return new EndlessField(_map);
    }
}