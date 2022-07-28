using System.Collections.Generic;
using System.Collections.Immutable;
using System.Drawing;
using Snapshooter.Xunit;
using TheLifeServices.Services;
using TheLiveLogic.Fields;
using Xunit;

namespace TheLiveLogic.Test;

public class MinimapGeneratorTests
{
    private readonly MinimapGenerator _generator;

    public MinimapGeneratorTests()
    {
        _generator = new MinimapGenerator();
    }

    [Fact]
    public void MinimapGenerator_Should_Generate_Minimap()
    {
        var map = new List<Coord>()
        {
            new Coord(3, 3),
            new Coord(4, 4),
            new Coord(4, 5),
            new Coord(3, 5),
            new Coord(2, 5),
            new Coord(-5, -5),
            new Coord(-4, -4),
            new Coord(-6, -6),
            new Coord(-3, -3)
        };

        var img = _generator.Generate(map, 140);

        var qwe = new ImageConverter();
        var stringImage = (byte[])qwe.ConvertTo(img, typeof(byte[]));

        Snapshot.Match(stringImage);
    }
}