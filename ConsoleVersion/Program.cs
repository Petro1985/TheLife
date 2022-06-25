// See https://aka.ms/new-console-template for more information

using ConsoleVersion;
using TheLiveLogic;
using TheLiveLogic.Maps;

var map = new EndlessMap();
var consoleOutput = new ConsoleOutput();

map.SetCell(new Coord(3, 3), true);
map.SetCell(new Coord(4, 4), true);
map.SetCell(new Coord(4, 5), true);
map.SetCell(new Coord(3, 5), true);
map.SetCell(new Coord(2, 5), true);

var theEngine = new LifeEngine();

while (true)
{
    var textMap = consoleOutput.CreateTextMap(map, 50);
    theEngine.MakeTurn(map);

    var curPos = Console.GetCursorPosition();
    Console.Write(textMap);
    Console.SetCursorPosition(curPos.Left, curPos.Top);
    await Task.Delay(100);
}
