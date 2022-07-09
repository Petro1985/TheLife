using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface ISimulatedFieldService
{
    Field MakeTurn(Guid userId, int simulatedFieldId);
    Field GetSimulatedField(Guid userId, int simulatedFieldId);
    int CreateSimulatedField(Guid userId, Field simulatedField);
    void DeleteSimulatedField(Guid userId, int simulatedFieldId);
}