namespace TheLiveLogic;

public class Rect
{
    public int X {set; get;}
    public int Y {set; get;}
    public int dX {set; get;}
    public int dY {set; get;}

    public Rect(int x, int y, int dx, int dy)
    {
        X = x;
        Y = y;
        dX = dx;
        dY = dy;
    }
}