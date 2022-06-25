using System.Collections.Concurrent;
using TheLiveLogic;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Maps;
using WebAPI.Interfaces;

namespace WebAPI.Controllers;

public class ActiveFieldService : IActiveFieldService
{
    private readonly ConcurrentDictionary<Guid, IMap> _activeField;
    private readonly LifeEngine _lifeEngine;

    public ActiveFieldService(LifeEngine lifeEngine)
    {
        _lifeEngine = lifeEngine;
        _activeField = new ConcurrentDictionary<Guid, IMap>();
    }

    public Field MakeTurn(Guid userId)
    {
        var map = _activeField.GetValueOrDefault(userId);
        if (map is null) return new Field(new List<Coord>());
        _lifeEngine.MakeTurn(map);
        return map.GetState();
    }

    public Field GetActiveField(Guid userId)
    {
        var map = _activeField.GetValueOrDefault(userId);
        if (map is null) return new Field(new List<Coord>());
        return map.GetState();
    }

    public void SetActiveField(Guid userId, Field field)
    {
        IMap map = new EndlessMap();
        map.SetState(field);

        _activeField.AddOrUpdate(userId, map, (_, _) => map);
    }

    public Field GetActiveFieldRect(Guid userId, Rect rect)
    {
        var map = _activeField.GetValueOrDefault(userId);
        return map is null ? new Field(new List<Coord>()) : map.GetSquareState(rect);
    }
}