using System.Collections.Immutable;
using System.Drawing;
using TheLiveLogic.Maps;

namespace TheLiveLogic.Interfaces;

public interface IMinimapGenerator
{
    Bitmap Generate(List<Coord> field);
}