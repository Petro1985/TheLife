namespace TheLiveLogic;

public class LifeEngine
{
    public void MakeTurn(IMap map)
    {
        var curState = map.GetState();
        var oldMap = map.Clone();

        foreach (var (x, y) in curState.Survivors)
        {
            var aliveNeighborsCount = oldMap.GetAliveNeighborsCount(x, y);

            if (aliveNeighborsCount is not (2 or 3))
            {
                map.SetState(x, y, false);
                continue;
            }

            var neighbors = (x, y).GetNeighbors();
            
            foreach (var neighbor in neighbors)
            {
                var aliveCount = oldMap.GetAliveNeighborsCount(neighbor.x, neighbor.y);
                if (aliveCount == 3)
                {
                    map.SetState(neighbor.x, neighbor.y, true);
                }
            }
        }
    }
}