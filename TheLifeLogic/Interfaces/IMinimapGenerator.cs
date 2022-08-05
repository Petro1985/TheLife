using System.Drawing;
using System.Runtime.InteropServices.ComTypes;
using TheLiveLogic.Fields;

namespace TheLiveLogic.Interfaces;

public interface IMinimapGenerator
{
    MemoryStream Generate(List<Coord> field, int fieldSize);
}