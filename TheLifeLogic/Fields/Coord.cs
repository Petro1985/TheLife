namespace TheLiveLogic.Fields;

public struct Coord
{
    public int X { get; set; }
    public int Y { get; set; }

    public Coord(int x, int y)
    {
        X = x;
        Y = y;
    }
    public static Coord Create(int x, int y)
        => new Coord(x, y);

}