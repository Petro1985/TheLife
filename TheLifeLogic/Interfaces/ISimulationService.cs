using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface ISimulationService
{
    List<SimulatedFieldWithOutId>? MakeTurn(Guid simulatedFieldId, int count);
    SimulatedField? GetSimulatedField(Guid simulatedFieldId);
    Guid CreateSimulatedField(Field simulatedField);
    void DeleteSimulatedField(Guid simulatedFieldId);
}