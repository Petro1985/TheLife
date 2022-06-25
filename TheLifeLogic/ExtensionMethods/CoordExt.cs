using TheLiveLogic.Maps;

namespace TheLiveLogic.ExtensionMethods;

public static class CoordExt
{
    public static bool OutBox(this Coord coord, Rect rect)
        => coord.X >= rect.X + rect.dX
           || coord.Y >= rect.Y + rect.dY
           || coord.X < rect.X 
           || coord.Y < rect.Y;    

    public static bool InBox(this Coord coord, Rect rect)
        => coord.X >= rect.X
           || coord.Y >= rect.Y
           || coord.X < rect.X + rect.dX 
           || coord.Y < rect.Y + rect.dY;    
    
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