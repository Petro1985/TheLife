using System.Text;

namespace TheLiveLogic;

public class ConsoleOutput
{
    public string CreateTextMap(IMap map, int renderSize)
    {
        StringBuilder result = new (renderSize * (renderSize + 2));
        
        for (var i = 0; i < renderSize; i++)
        {
            for (var j = 0; j < renderSize; j++)
            {
                result.Append(map.IsAlive(i, j) ? 'O' : '.');   
            }

            result.Append('\n');
        }

        return result.ToString();
    } 
}