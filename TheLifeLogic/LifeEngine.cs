using TheLiveLogic.ExtensionMethods;
using TheLiveLogic.Fields;

namespace TheLiveLogic;

public class LifeEngine
{
    private readonly HashSet<Coord> _neighborsChecked = new HashSet<Coord>();
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
            }

            var neighbors = coord.GetNeighbors();
            
            foreach (var neighborCoord in neighbors)
            {
                if (_neighborsChecked.Contains(neighborCoord)) continue;        // todo: need to benchmark it!
                _neighborsChecked.Add(neighborCoord);
                
                var aliveCount = oldMap.GetAliveNeighborsCount(neighborCoord);
                if (aliveCount == 3)
                {
                    field.SetCell(neighborCoord, true);
                }
            }
        }
        _neighborsChecked.Clear();
    }
}