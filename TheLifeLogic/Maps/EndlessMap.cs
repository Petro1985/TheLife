namespace TheLiveLogic.Maps;

public class EndlessMap : IMap
{
    private HashSet<(int, int)> _map;

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

    // public override string ToString()
    // {
    //     var renderSize = _map.GetLength(0);
    //     
    //     StringBuilder result = new (renderSize * (renderSize + 2));
    //     
    //     for (var i = 0; i < renderSize; i++)
    //     {
    //         for (var j = 0; j < renderSize; j++)
    //         {
    //             result.Append(IsAlive(i, j) ? 'O' : '.');   
    //         }
    //
    //         result.Append('\n');
    //     }
    //
    //     return result.ToString();
    // }
}