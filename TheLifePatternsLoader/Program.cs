using TheLifePatternsLoader;

Console.WriteLine("Patterns loading started");
var patternLoader = new PatternsLoadService();
await patternLoader.FillPatterns();
Console.WriteLine("Patterns loaded");


