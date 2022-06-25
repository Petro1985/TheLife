using System.Text;
using TheLiveLogic.DataStruct;
using TheLiveLogic.ExtensionMethods;

namespace TheLiveLogic.Maps;

public class Map : IMap
{
    private readonly bool[,] _map;

    public Map(int size)
    {
        _map = new bool[size, size];
    }

    public bool IsAlive(Coord coord)
    {
        if (OutBox(coord.X, coord.Y)) return false;
        return _map[coord.X, coord.Y];
    }

    public void SetCell(Coord coord, bool state)
    {
        if (OutBox(coord.X, coord.Y)) return;
        _map[coord.X, coord.Y] = state;
    }

    private bool OutBox(int x, int y)
        => x >= _map.GetLength(0)
           || y >= _map.GetLength(1)
           || x < 0 
           || y < 0;
    
    public void SetState(Field lState)
    {
        var length = _map.GetLength(0);
        var newMap = lState.Survivors.Aggregate(new bool[length, length], (newMap, cell) =>
        {
            if (OutBox(cell.X, cell.Y)) return newMap;
            newMap[cell.X, cell.Y] = true;
            return newMap;
        });
        Array.Copy(newMap, _map, _map.Length);
    }

    public Field GetState()
    {
        List<Coord> lifes = new ();

        for (var i = 0; i < _map.GetLongLength(0); i++)
        {
            for (var j = 0; j < _map.GetLongLength(1); j++)
            {
                if (_map[i, j])
                {
                    lifes.Add(new Coord(i, j));
                }
            }
        }
        return new Field(lifes);
    }

    public Field GetSquareState(Rect rect)
    {
        List<Coord> lifes = new ();

        var rows = Math.Min(_map.GetLongLength(0), rect.Y + rect.dY);
        var cols = Math.Min(_map.GetLongLength(0), rect.X + rect.dX);
        for (var i = rect.X; i < rows; i++)
        {
            for (var j = 0; j < cols; j++)
            {
                if (_map[i, j])
                {
                    lifes.Add(new Coord(i, j));
                }
            }
        }

        return new Field(lifes);
    }

    public int GetAliveNeighborsCount(Coord coord)
    {
        var neighbors = coord.GetNeighbors();
        
        return neighbors.Count(IsAlive);
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
                result.Append(IsAlive(new Coord(i, j)) ? 'O' : '.');   
            }

            result.Append('\n');
        }

        return result.ToString();
    }
}