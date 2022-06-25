using System.Collections.Immutable;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using TheLiveLogic.Interfaces;
using TheLiveLogic.Maps;

namespace TheLifeServices.Services;

public class MinimapGenerator : IMinimapGenerator
{
    const int MinimapSize = 140;
    public Bitmap Generate(List<Coord> field)
    {
        if (field.Count == 0) return new Bitmap(MinimapSize, MinimapSize);
        
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

        var size = Math.Max(maxX - minX + 1, maxY - minY + 1);
        var minMapOffset = 0;
        if (size < 10)
        {
            minMapOffset = (10 - size) / 2;
            size = 10;
        }
        
        var minimap = new Bitmap(size, size);

        using var g = Graphics.FromImage(minimap);
        g.FillRectangle(new SolidBrush(Color.Gray),0, 0, size, size);
        g.Flush();
        
        foreach (var coord in field)
        {
            minimap.SetPixel(coord.X - minX + minMapOffset, coord.Y - minY + minMapOffset, Color.Chartreuse);
        }

        minimap = ResizeImage(minimap, MinimapSize, MinimapSize);

        return minimap;
    }
    
    private Bitmap ResizeImage(Image image, int width, int height)
    {
        var destRect = new Rectangle(0, 0, width, height);
        var destImage = new Bitmap(width, height);

        destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

        using (var graphics = Graphics.FromImage(destImage))
        {
            graphics.CompositingMode = CompositingMode.SourceCopy;
            graphics.CompositingQuality = CompositingQuality.HighQuality;
            graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

            using (var wrapMode = new ImageAttributes())
            {
                wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                graphics.DrawImage(image, destRect, 0, 0, image.Width,image.Height, GraphicsUnit.Pixel, wrapMode);
            }
        }

        return destImage;
    }
}