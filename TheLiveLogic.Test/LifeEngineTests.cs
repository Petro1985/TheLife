using Snapshooter.Xunit;
using TheLiveLogic.Maps;
using Xunit;

namespace TheLiveLogic.Test;

public class LifeEngineTests
{
    [Fact]
    public void LifeLogicTenTurnCheck()
    {
        var map = new EndlessMap();
        map.SetCell(new Coord(3, 3), true);
        map.SetCell(new Coord(4, 4), true);
        map.SetCell(new Coord(4, 5), true);
        map.SetCell(new Coord(3, 5), true);
        map.SetCell(new Coord(2, 5), true);

        var theLife = new TheLife(map, new LifeEngine());

        for (var i = 0; i < 9; i++)
        {
            theLife.MakeTurn();
        }

        var newTurnState = theLife.MakeTurn();
        Snapshot.Match(newTurnState);
    }
}


/*
{"x":3, "y":3},
{"x":4, "y":4},
{"x":4, "y":5},
{"x":3, "y":5},
{"x":2, "y":5}
*/
