using System.Text;
using TheLiveLogic.ExtensionMethods;

namespace TheLiveLogic.Fields;

public class TorusField : IFieldLogic
{
    private readonly bool[,] _survivors;

    public TorusField(int size)
    {
        _survivors = new bool[size, size];
    }

    public bool IsAlive(Coord coord)
    {
        var newCoord = CoordNormalizer(coord);
        return _survivors[newCoord.X, newCoord.Y];
    }

    public void SetCell(Coord coord, bool state)
    {
        var newCoord = CoordNormalizer(coord);
        _survivors[newCoord.X, newCoord.Y] = state;
    }

    private Coord CoordNormalizer(Coord coord)
    {
        var arrayLength = _survivors.GetLength(0);
        var newX = ((coord.X % arrayLength) + arrayLength) % arrayLength;
        var newY = ((coord.Y % arrayLength) + arrayLength) % arrayLength;

        return new Coord(newX, newY);
    }

    public void SetState(DataStruct.Field lState)
    {
        var length = _survivors.GetLength(0);
        var newMap = lState.Survivors.Aggregate(new bool[length, length], (newMap, cell) =>
        {
            var newCoord = CoordNormalizer(cell);
            newMap[newCoord.X, newCoord.Y] = true;
            return newMap;
        });
        Array.Copy(newMap, _survivors, _survivors.Length);
    }
    public DataStruct.Field GetField()
    {
        return new DataStruct.Field {Survivors = GetSurvivors()};;
    }

    public List<Coord> GetSurvivors()
    {
        List<Coord> lives = new ();

        for (var i = 0; i < _survivors.GetLongLength(0); i++)
        {
            for (var j = 0; j < _survivors.GetLongLength(1); j++)
            {
                if (_survivors[i, j])
                {
                    lives.Add(new Coord(i, j));
                }
            }
        }

        return lives;
    }

    public DataStruct.Field GetSquareState(Rect rect)
    {
        List<Coord> lifes = new ();

        var rows = Math.Min(_survivors.GetLongLength(0), rect.Y + rect.dY);
        var cols = Math.Min(_survivors.GetLongLength(0), rect.X + rect.dX);
        for (var i = rect.X; i < rows; i++)
        {
            for (var j = 0; j < cols; j++)
            {
                if (_survivors[i, j])
                {
                    lifes.Add(new Coord(i, j));
                }
            }
        }

        return new DataStruct.Field(lifes);
    }

    public int GetAliveNeighborsCount(Coord coord)
    {
        var neighbors = coord.GetNeighbors();
        
        return neighbors.Count(IsAlive);
    }

    public IFieldLogic Clone()
    {
        var newMap = new TorusField(_survivors.GetLength(0));
        Array.Copy(_survivors, newMap._survivors, _survivors.Length);
        return newMap;
    }

    public override string ToString()
    {
        var renderSize = _survivors.GetLength(0);
        
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