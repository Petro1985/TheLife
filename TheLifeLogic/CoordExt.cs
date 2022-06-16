using TheLiveLogic.Maps;

namespace TheLiveLogic;

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
}