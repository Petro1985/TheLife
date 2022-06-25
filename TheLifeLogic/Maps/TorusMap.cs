using System.Text;
using TheLiveLogic.DataStruct;
using TheLiveLogic.ExtensionMethods;

namespace TheLiveLogic.Maps;

public class TorusMap : IMap
{
    private readonly bool[,] _map;

    public TorusMap(int size)
    {
        _map = new bool[size, size];
    }

    public bool IsAlive(Coord coord)
    {
        var newCoord = CoordNormalizer(coord);
        return _map[newCoord.X, newCoord.Y];
    }

    public void SetCell(Coord coord, bool state)
    {
        var newCoord = CoordNormalizer(coord);
        _map[newCoord.X, newCoord.Y] = state;
    }

    private Coord CoordNormalizer(Coord coord)
    {
        var arrayLength = _map.GetLength(0);
        var newX = ((coord.X % arrayLength) + arrayLength) % arrayLength;
        var newY = ((coord.Y % arrayLength) + arrayLength) % arrayLength;

        return new Coord(newX, newY);
    }

    public void SetState(Field lState)
    {
        var length = _map.GetLength(0);
        var newMap = lState.Survivors.Aggregate(new bool[length, length], (newMap, cell) =>
        {
            var newCoord = CoordNormalizer(cell);
            newMap[newCoord.X, newCoord.Y] = true;
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
                result.Append(IsAlive(new Coord(i, j)) ? 'O' : '.');   
            }

            result.Append('\n');
        }

        return result.ToString();
    }
}