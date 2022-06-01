﻿// See https://aka.ms/new-console-template for more information

using TheLiveLogic;

var map = new EndlessMap();
var consoleOutput = new ConsoleOutput();

map.SetCell(3, 3, true);
map.SetCell(4, 4, true);
map.SetCell(4, 5, true);
map.SetCell(3, 5, true);
map.SetCell(2, 5, true);

var theLife = new TheLife(map, new LifeEngine());

while (true)
{
    var textMap = consoleOutput.CreateTextMap(theLife.Map, 50);
    var turnState = theLife.MakeTurn();

    var curPos = Console.GetCursorPosition();
    Console.Write(textMap);
    Console.SetCursorPosition(curPos.Left, curPos.Top);
    await Task.Delay(100);
}
