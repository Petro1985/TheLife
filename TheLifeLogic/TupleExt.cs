using TheLiveLogic.Maps;

namespace TheLiveLogic;

public static class TupleExt
{
    public static List<Coord> GetNeighbors(this Coord coord)
    {
        var neighbors = new List<Coord>
        {
            new (coord.X - 1, coord.Y - 1),
            new (coord.X, coord.Y - 1),
            new (coord.X + 1, coord.Y - 1),
            new (coord.X - 1, coord.Y),
            new (coord.X + 1, coord.Y),
            new (coord.X, coord.Y + 1),
            new (coord.X + 1, coord.Y + 1),
            new (coord.X - 1, coord.Y + 1),
        };
        return neighbors;
    }
}