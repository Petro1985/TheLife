using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface ISimulationService
{
    SimulatedField? MakeTurn(Guid simulatedFieldId);
    SimulatedField? GetSimulatedField(Guid simulatedFieldId);
    Guid CreateSimulatedField(Field simulatedField);
    void DeleteSimulatedField(Guid simulatedFieldId);
}