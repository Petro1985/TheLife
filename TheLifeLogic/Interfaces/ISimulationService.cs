using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface ISimulationService
{
    List<FieldWithoutId>? MakeTurn(Guid simulatedFieldId, int count = 1);
    SimulatedField? GetSimulatedField(Guid simulatedFieldId);
    Guid CreateSimulatedField(Field simulatedField);
    void DeleteSimulatedField(Guid simulatedFieldId);
}