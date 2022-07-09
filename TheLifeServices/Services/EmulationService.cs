using System.Collections.Concurrent;
using TheLiveLogic;
using TheLiveLogic.Fields;
using TheLiveLogic.Interfaces;
using Field = TheLiveLogic.DataStruct.Field;

namespace TheLifeServices.Services;

public class EmulationService : ISimulatedFieldService
{
    private readonly ConcurrentDictionary<Guid, Dictionary<int, IField>> _activeField;
    private readonly LifeEngine _lifeEngine;

    public EmulationService(LifeEngine lifeEngine)
    {
        _lifeEngine = lifeEngine;
        _activeField = new ConcurrentDictionary<Guid, Dictionary<int, IField>>();
    }

    public Field MakeTurn(Guid userId, int simulatedFieldId)
    {
        var userSimulatedFields = _activeField.GetValueOrDefault(userId);
        if (userSimulatedFields is null) return new Field(new List<Coord>());
        var simulatedField = userSimulatedFields.GetValueOrDefault(simulatedFieldId);
        if (simulatedField is null) return new Field(new List<Coord>());
        
        _lifeEngine.MakeTurn(simulatedField);
        var newSimulatedField = simulatedField.GetState();
        newSimulatedField.Id = simulatedFieldId;
        
        return newSimulatedField;
    }

    public Field GetSimulatedField(Guid userId, int simulatedFieldId)
    {
        var userSimulatedFields = _activeField.GetValueOrDefault(userId);
        if (userSimulatedFields is null) return new Field(new List<Coord>());
        var simulatedField = userSimulatedFields.GetValueOrDefault(simulatedFieldId);
        if (simulatedField is null) return new Field(new List<Coord>());
        
        return simulatedField.GetState();
    }

    public int CreateSimulatedField(Guid userId, Field simulatedField)
    {
        IField newSimulatedField = new EndlessField();
        var lastId = 0;
        
        newSimulatedField.SetState(simulatedField);

        var userSimulatedFields = _activeField.GetValueOrDefault(userId);
        if (userSimulatedFields is null)
        {
            userSimulatedFields = new Dictionary<int, IField>();
            _activeField.TryAdd(userId, userSimulatedFields);
        }
        else
        {
            if (userSimulatedFields.Count > 0)
            {
                lastId = userSimulatedFields.Keys.Max();
            }
        }
        
        userSimulatedFields.Add(lastId + 1, newSimulatedField);
        
        return lastId + 1;
    }

    public void DeleteSimulatedField(Guid userId, int simulatedFieldId)
    {
        var userSimulatedFields = _activeField.GetValueOrDefault(userId);
        var simulatedField = userSimulatedFields?.GetValueOrDefault(simulatedFieldId);
        if (simulatedField is null) return;

        userSimulatedFields!.Remove(simulatedFieldId);
    }
}