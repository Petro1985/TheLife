using System.Security.Authentication.ExtendedProtection;
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
        map.SetCell(3, 3, true);
        map.SetCell(4, 4, true);
        map.SetCell(4, 5, true);
        map.SetCell(3, 5, true);
        map.SetCell(2, 5, true);

        var theLife = new TheLife(map, new LifeEngine());

        for (var i = 0; i < 9; i++)
        {
            theLife.MakeTurn();
        }

        var newTurnState = theLife.MakeTurn();
        Snapshot.Match(newTurnState);
    }
}