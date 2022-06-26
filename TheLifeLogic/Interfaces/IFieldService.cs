using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IFieldService
{
    Task<long> SaveField(Field state);
    Task<List<Field>> LoadAllFields();
    Task<Field?> LoadField(int fieldId);
    Task<bool> UpdateField(Field field, int fieldId);
}

