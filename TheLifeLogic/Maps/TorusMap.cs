using System.Text;

namespace TheLiveLogic.Maps;

public class TorusMap : IMap
{
    private readonly bool[,] _map;

    public TorusMap(int size)
    {
        _map = new bool[size, size];
    }

    public bool IsAlive(int x, int y)
    {
        var (newX, newY) = CoordNormolizer(x, y);
        return _map[newX, newY];
    }

    public void SetCell(int x, int y, bool state)
    {
        var (newX, newY) = CoordNormolizer(x, y);
        _map[newX, newY] = state;
    }

    private (int x, int y) CoordNormolizer(int x, int y)
    {
        var arrayLength = _map.GetLength(0);
        var newX = ((x % arrayLength) + arrayLength) % arrayLength;
        var newY = ((y % arrayLength) + arrayLength) % arrayLength;

        return (newX, newY);
    }

    public void SetState(LifeState lState)
    {
        var length = _map.GetLength(0);
        var newMap = lState.Survivors.Aggregate(new bool[length, length], (newMap, cell) =>
        {
            var (x, y) = CoordNormolizer(cell.x, cell.y);
            newMap[x, y] = true;
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
        var newMap = new TorusMap(_map.GetLength(0));
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