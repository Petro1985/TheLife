using Microsoft.Extensions.Caching.Memory;
using TheLiveLogic;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Fields;
using TheLiveLogic.Interfaces;
using Field = TheLiveLogic.DataStruct.Field;

namespace TheLifeServices.Services;

public class SimulationService : ISimulationService
{
    private readonly IMemoryCache _simulatedFields;
    private readonly LifeEngine _lifeEngine;
    private readonly MemoryCacheEntryOptions _simulatedFieldsCacheOptions;
    private readonly Object _lockMark = new ();

    public SimulationService(LifeEngine lifeEngine, IMemoryCache simulatedFields)
    {
        _lifeEngine = lifeEngine;
        _simulatedFields = simulatedFields;
        _simulatedFieldsCacheOptions = new MemoryCacheEntryOptions
        {
            SlidingExpiration = TimeSpan.FromHours(1),
        };
    }

    public List<SimulatedFieldWithOutId>? MakeTurn(Guid simulatedFieldId, int count)
    {
        var isFieldInCache = _simulatedFields.TryGetValue(simulatedFieldId, out IFieldLogic simulatedField);
        if (isFieldInCache == false) return null;

        var result = new List<SimulatedFieldWithOutId>();

        lock (_lockMark)
        {
            for (var i = 0; i < count; i++)
            {
                _lifeEngine.MakeTurn(simulatedField);
                result.Add(new SimulatedFieldWithOutId {Survivors = simulatedField.GetSurvivors()});
            }            
        }

        
        return result;
    }

    public SimulatedField? GetSimulatedField(Guid simulatedFieldId)
    {
        var newSimulatedField = new SimulatedField {Id = simulatedFieldId};
        
        var isFieldInCache = _simulatedFields.TryGetValue(simulatedFieldId, out IFieldLogic simulatedField);
        if (isFieldInCache == false) return null;

        newSimulatedField.Survivors = simulatedField.GetSurvivors();
        
        return newSimulatedField;
    }

    public Guid CreateSimulatedField(Field simulatedField)
    {
        IFieldLogic newSimulatedField = new EndlessField();
        
        newSimulatedField.SetState(simulatedField);

        var newSimulatedFieldId = Guid.NewGuid();
        
        _simulatedFields.Set(newSimulatedFieldId, newSimulatedField, _simulatedFieldsCacheOptions);

        return newSimulatedFieldId;
    }

    public void DeleteSimulatedField(Guid simulatedFieldId)
    {
        var isFieldInCache = _simulatedFields.Get<IFieldLogic>(simulatedFieldId);
        if (isFieldInCache is null) return;

        _simulatedFields.Remove(simulatedFieldId);
    }
}