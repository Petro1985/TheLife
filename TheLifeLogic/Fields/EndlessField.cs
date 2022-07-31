using TheLiveLogic.ExtensionMethods;

namespace TheLiveLogic.Fields;

public class EndlessField : IFieldLogic
{
    private readonly HashSet<Coord> _survivors;

    public EndlessField()
    {
        _survivors = new HashSet<Coord>();
    }
    
    private EndlessField(HashSet<Coord> map)
    {
        _survivors = new HashSet<Coord>(map);
    }
    
    public bool IsAlive(Coord coord)
        => _survivors.Contains(coord);

    public void SetCell(Coord coord, bool state)
    {
        if (state)
        {
            _survivors.Add(coord);
        }
        else
        {
            _survivors.Remove(coord);
        }
    }

    public void SetState(DataStruct.Field lState)
    {
        _survivors.Clear();
        _survivors.UnionWith(lState.Survivors);
    }

    public DataStruct.Field GetField()
    {
        return new DataStruct.Field {Survivors = _survivors.ToList()};
    }

    public List<Coord> GetSurvivors()
    {
        return _survivors.ToList();
    }

    public DataStruct.Field GetSquareState(Rect rect)
    {
        var result = _survivors.Where(lifeCoord => lifeCoord.InBox(rect)).ToList();
        return new DataStruct.Field(result);
    }
    
    public int GetAliveNeighborsCount(Coord coord)
    {
        var neighbors = coord.GetNeighbors();
        var aliveNeighborsCount = neighbors.Count(IsAlive);
        return aliveNeighborsCount;
    }

    public IFieldLogic Clone()
    {
        return new EndlessField(_survivors);
    }
}