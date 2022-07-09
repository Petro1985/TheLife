using System;
using System.Collections.Generic;
using Snapshooter.Xunit;
using TheLiveLogic.Fields;
using Xunit;

namespace TheLiveLogic.Test;

public class LifeEngineTests
{
    [Fact]
    public void LifeLogicTenTurnCheck()
    {
        var map = new EndlessField();
        map.SetCell(new Coord(3, 3), true);
        map.SetCell(new Coord(4, 4), true);
        map.SetCell(new Coord(4, 5), true);
        map.SetCell(new Coord(3, 5), true);
        map.SetCell(new Coord(2, 5), true);

        var theEngine = new LifeEngine();

        for (var i = 0; i < 9; i++)
        {
            theEngine.MakeTurn(map);
        }

        theEngine.MakeTurn(map);
        var newTurnState = map.GetState();
        Snapshot.Match(newTurnState);
    }
}