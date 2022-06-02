using System.Text;

namespace TheLiveLogic.Maps;

public class Map : IMap
{
    private readonly bool[,] _map;

    public Map(int size)
    {
        _map = new bool[size, size];
    }

    public bool IsAlive(int x, int y)
    {
        if (OutBox(x, y)) return false;
        return _map[x, y];
    }

    public void SetCell(int x, int y, bool state)
    {
        if (OutBox(x, y)) return;
        _map[x, y] = state;
    }

    private bool OutBox(int x, int y)
        => x >= _map.GetLength(0)
           || y >= _map.GetLength(1)
           || x < 0 
           || y < 0;
    
    public void SetState(LifeState lState)
    {
        var length = _map.GetLength(0);
        var newMap = lState.Survivors.Aggregate(new bool[length, length], (newMap, cell) =>
        {
            if (OutBox(cell.x, cell.y)) return newMap;
            newMap[cell.x, cell.y] = true;
            return newMap;
        });
        Array.Copy(newMap, _map, _map.Length);
    }

    public LifeState GetState()
    {
        List<(int x, int y)> lifes = new ();

        for (var i = 0; i < _map.GetLongLength(0); i++)
        {
            for (var j = 0; j < _map.GetLongLength(1); j++)
            {
                if (_map[i, j])
                {
                    lifes.Add((i, j));
                }
            }
        }
        return new LifeState(lifes);
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

    public override string ToString()
    {
        var renderSize = _map.GetLength(0);
        
        StringBuilder result = new (renderSize * (renderSize + 2));
        
        for (var i = 0; i < renderSize; i++)
        {
            for (var j = 0; j < renderSize; j++)
            {
                result.Append(IsAlive(i, j) ? 'O' : '.');   
            }

            result.Append('\n');
        }

        return result.ToString();
    }
}