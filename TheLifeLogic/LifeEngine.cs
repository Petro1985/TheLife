using TheLiveLogic.Maps;

namespace TheLiveLogic;

public class LifeEngine
{
    public void MakeTurn(IMap map)
    {
        var curState = map.GetState();
        var oldMap = map.Clone();

        foreach (var coord in curState.Survivors)
        {
            var aliveNeighborsCount = oldMap.GetAliveNeighborsCount(coord);

            if (aliveNeighborsCount is not (2 or 3))
            {
                map.SetCell(coord, false);
                continue;
            }

            var neighbors = coord.GetNeighbors();
            
            foreach (var neighborCoord in neighbors)
            {
                var aliveCount = oldMap.GetAliveNeighborsCount(neighborCoord);
                if (aliveCount == 3)
                {
                    map.SetCell(neighborCoord, true);
                }
            }
        }
    }
}