using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IActiveFieldService
{
    Field MakeTurn(Guid userId);
    Field GetActiveField(Guid userId);
    void SetActiveField(Guid userId, Field field);
    Field GetActiveFieldRect(Guid userId, Rect rect);
}