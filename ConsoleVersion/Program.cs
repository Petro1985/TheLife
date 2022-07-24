// See https://aka.ms/new-console-template for more information

using ConsoleVersion;
using TheLiveLogic;
using TheLiveLogic.Fields;

var map = new EndlessField();
var consoleOutput = new ConsoleOutput();

map.SetCell(new Coord(3, 3), true);
map.SetCell(new Coord(3, 4), true);
map.SetCell(new Coord(4, 3), true);
map.SetCell(new Coord(4, 4), true);
map.SetCell(new Coord(5, 3), true);
map.SetCell(new Coord(5, 4), true);
map.SetCell(new Coord(6, 3), true);
map.SetCell(new Coord(6, 4), true);
map.SetCell(new Coord(7, 3), true);
map.SetCell(new Coord(7, 4), true);


var theEngine = new LifeEngine();

while (true)
{
    var textMap = consoleOutput.CreateTextMap(map, 50);
    theEngine.MakeTurn(map);

    var curPos = Console.GetCursorPosition();
    Console.Write(textMap);
    Console.SetCursorPosition(curPos.Left, curPos.Top);
    Console.ReadKey();
}
