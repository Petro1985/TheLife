using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;
using TheLiveLogic.Fields;
using TheLiveLogic.Interfaces;

namespace TheLifeServices.Services;

public class MinimapGenerator : IMinimapGenerator
{
    private const int Paddings = 5;        // paddings in percents from fieldSize
    private const int MinPaddings = 2;     // minimal paddings from each side
    public MemoryStream Generate(List<Coord> field, int minimapSize)
    {
        if (field.Count == 0)
        {
            Image emptyImage = new Image<Rgb24>(minimapSize, minimapSize);
            emptyImage.Mutate(x => x.Fill(Color.Gray));
            var emptyStream = new MemoryStream();
            emptyImage.Save(emptyStream, new PngEncoder());
            return emptyStream;
        }
            
        var maxX = field[0].X;
        var maxY = field[0].Y;
        var minX = field[0].X;
        var minY = field[0].Y;
        
        foreach (var coord in field)
        {
            if (coord.X > maxX) maxX = coord.X;
            if (coord.Y > maxY) maxY = coord.Y;
            if (coord.X < minX) minX = coord.X;
            if (coord.Y < minY) minY = coord.Y;
        }

        var width = maxX - minX + 1;
        var height = maxY - minY + 1;
        var size = Math.Max(
            width + Math.Max(width*2*Paddings/100, MinPaddings),
            height + Math.Max(height*2*Paddings/100, MinPaddings));
        
        int mapOffsetX;
        int mapOffsetY;
        
        if (size < 10)
        {
            mapOffsetX = (10 - width) / 2;
            mapOffsetY = (10 - height) / 2;
            size = 10;
        }
        else
        {
            mapOffsetX = (size - width) / 2;
            mapOffsetY = (size - height) / 2;
        }
        
        Image image = new Image<Rgb24>(size, size);
        
        image.Mutate(x => x.Fill(Color.Gray));

        foreach (var coord in field)
        {
            image.Mutate(x => x.Draw(new Pen(Color.Chartreuse, 1), 
                new RectangleF(coord.X - minX + mapOffsetX, coord.Y - minY + mapOffsetY,0,0)));
        }
        
        image.Mutate(x => x.Resize(minimapSize, minimapSize, new NearestNeighborResampler()));
        var stream = new MemoryStream();
        image.Save(stream, new PngEncoder());

        return stream;
    }
}