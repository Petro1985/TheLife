using System.Text;
using TheLiveLogic.ExtensionMethods;

namespace TheLiveLogic.Fields;

public class ArrayField : IFieldLogic
{
    private readonly bool[,] _survivors;

    public ArrayField(int size)
    {
        _survivors = new bool[size, size];
    }

    public bool IsAlive(Coord coord)
    {
        if (OutBox(coord.X, coord.Y)) return false;
        return _survivors[coord.X, coord.Y];
    }

    public void SetCell(Coord coord, bool state)
    {
        if (OutBox(coord.X, coord.Y)) return;
        _survivors[coord.X, coord.Y] = state;
    }

    private bool OutBox(int x, int y)
        => x >= _survivors.GetLength(0)
           || y >= _survivors.GetLength(1)
           || x < 0 
           || y < 0;
    
    public void SetState(DataStruct.Field lState)
    {
        var length = _survivors.GetLength(0);
        var newMap = lState.Survivors.Aggregate(new bool[length, length], (newMap, cell) =>
        {
            if (OutBox(cell.X, cell.Y)) return newMap;
            newMap[cell.X, cell.Y] = true;
            return newMap;
        });
        Array.Copy(newMap, _survivors, _survivors.Length);
    }

    public DataStruct.Field GetField()
    {

        var lives = GetSurvivors();

        return new DataStruct.Field {Survivors = lives};
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
        List<Coord> lives = new ();

        var rows = Math.Min(_survivors.GetLongLength(0), rect.Y + rect.dY);
        var cols = Math.Min(_survivors.GetLongLength(0), rect.X + rect.dX);
        for (var i = rect.X; i < rows; i++)
        {
            for (var j = 0; j < cols; j++)
            {
                if (_survivors[i, j])
                {
                    lives.Add(new Coord(i, j));
                }
            }
        }

        return new DataStruct.Field(lives);
    }

    public int GetAliveNeighborsCount(Coord coord)
    {
        var neighbors = coord.GetNeighbors();
        
        return neighbors.Count(IsAlive);
    }

    public IFieldLogic Clone()
    {
        var newField = new ArrayField(_survivors.GetLength(0));
        Array.Copy(_survivors, newField._survivors, _survivors.Length);
        return newField;
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