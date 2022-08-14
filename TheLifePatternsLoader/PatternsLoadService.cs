using System.Text;
using LifeDataBase;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLifeServices.Services;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Fields;

namespace TheLifePatternsLoader;

public class PatternsLoadService
{
    public async Task FillPatterns()
    {
        MinimapGenerator minimapGenerator = new ();
        const int minimapImageSize = 300;

        var files = Directory.GetFiles("./Patterns");

        var optBuilder = new DbContextOptionsBuilder<FieldContext>();

        var connectionString = Environment.GetEnvironmentVariable("DB_Settings:connectionString");
        optBuilder.UseNpgsql(connectionString ?? @"Server=127.0.0.1;Port=5432;Database=TheLife;User Id=postgres;password=123qwe!@#QWE");
        var context = new FieldContext(optBuilder.Options);
        
        foreach (var file in files)
        {
            var pattern = new PatternEntity();
            
            var inputText = (await File.ReadAllTextAsync(file)).Split('\n');

            pattern.Name = inputText[0];
            pattern.Description = inputText[1];
            var fieldText = inputText
                .Skip(2)
                .Aggregate(new StringBuilder(), (strBuilder, str) =>
                {
                    strBuilder.Append(str);
                    return strBuilder;
                }).ToString();

            try
            {
                pattern.Survivors = ParseFieldText(fieldText);
            }
            catch (ArgumentException e)
            {
                Console.WriteLine($"Couldn't read file {file}: " + e.Message);
                continue;
            }

            using var stream = minimapGenerator.Generate(pattern.Survivors, minimapImageSize);
            stream.Position = 0;
            pattern.PreviewBase64 = Convert.ToBase64String(stream.ToArray());
            pattern.LastChange = DateTime.UtcNow;

            context.Patterns.Add(pattern);
        }

        await context.SaveChangesAsync();
    }

    private List<Coord> ParseFieldText(string input)
    {
        var field = new List<Coord>();
        var lastNumber = 0;
        var currentY = 0;
        var currentX = 0;

        foreach (var c in input)
        {
            switch (c)
            {
                case 'o':
                    lastNumber = Math.Max(1, lastNumber);
                    for (var j = 0; j < lastNumber; j++)
                    {
                        field.Add(new Coord(currentX + j, currentY));
                    }
                    currentX += lastNumber;
                    lastNumber = 0;
                    break;
                case 'b':
                    currentX += lastNumber == 0 ? 1 : lastNumber;
                    lastNumber = 0;
                    break;
                case '$':
                    lastNumber = 0;
                    currentX = 0;
                    currentY++;
                    break;
                case '!':
                    break;
                case >= '0' and <= '9':
                    lastNumber = lastNumber * 10 + int.Parse(c.ToString());
                    break;
                default: break;// throw new ArgumentException($"Unexpected symbol \'{c}\' (can be only [ab$0-9])");
            }
        }

        return field;
    }
}