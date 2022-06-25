using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IFieldRepository
{
    Task<long> SaveField(Field state);
    Task<List<Field>> LoadAllFields();
    Task<Field?> LoadField(int fieldId);
    Task UpdateField(Field state, int fieldId);
}