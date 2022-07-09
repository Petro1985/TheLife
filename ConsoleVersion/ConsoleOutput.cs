using System.Text;
using TheLiveLogic.Fields;

namespace ConsoleVersion;

public class ConsoleOutput
{
    public string CreateTextMap(IField field, int renderSize)
    {
        StringBuilder result = new (renderSize * (renderSize + 2));
        
        for (var i = 0; i < renderSize; i++)
        {
            for (var j = 0; j < renderSize; j++)
            {
                result.Append(field.IsAlive(new Coord(i, j)) ? 'O' : '.');   
            }

            result.Append('\n');
        }

        return result.ToString();
    } 
}