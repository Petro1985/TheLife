using System.Drawing;
using TheLiveLogic.Fields;

namespace TheLiveLogic.Interfaces;

public interface IMinimapGenerator
{
    Bitmap Generate(List<Coord> field, int fieldSize);
}