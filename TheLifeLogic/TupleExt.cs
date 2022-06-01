namespace TheLiveLogic;

public static class TupleExt
{
    public static List<(int x, int y)> GetNeighbors(this (int x, int y) coord)
    {
        var neighbors = new List<(int x, int y)>
        {
            (coord.x - 1, coord.y - 1),
            (coord.x, coord.y - 1),
            (coord.x + 1, coord.y - 1),
            (coord.x - 1, coord.y),
            (coord.x + 1, coord.y),
            (coord.x, coord.y + 1),
            (coord.x + 1, coord.y + 1),
            (coord.x - 1, coord.y + 1),
        };
        return neighbors;
    }
}