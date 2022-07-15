using TheLiveLogic.ExtensionMethods;
using TheLiveLogic.Fields;

namespace TheLiveLogic;

public class LifeEngine
{
    public void MakeTurn(IFieldLogic field)
    {
        var curState = field.GetField();
        var oldMap = field.Clone();

        foreach (var coord in curState.Survivors)
        {
            var aliveNeighborsCount = oldMap.GetAliveNeighborsCount(coord);

            if (aliveNeighborsCount is not (2 or 3))
            {
                field.SetCell(coord, false);
                continue;
            }

            var neighbors = coord.GetNeighbors();
            
            foreach (var neighborCoord in neighbors)
            {
                var aliveCount = oldMap.GetAliveNeighborsCount(neighborCoord);
                if (aliveCount == 3)
                {
                    field.SetCell(neighborCoord, true);
                }
            }
        }
    }
}