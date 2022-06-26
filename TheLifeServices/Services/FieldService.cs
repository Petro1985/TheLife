using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace TheLifeServices.Services;

public class FieldService : IFieldService
{
    private readonly IFieldRepository _fieldRepository;


    public FieldService(IFieldRepository fieldRepository)
    {
        _fieldRepository = fieldRepository;
    }

    public async Task<long> SaveField(Field state)
    {
        return await _fieldRepository.SaveField(state);
    }

    public async Task<List<Field>> LoadAllFields()
    {
        return await _fieldRepository.LoadAllFields();
    }

    public async Task<Field?> LoadField(int fieldId)
    {
        return await _fieldRepository.LoadField(fieldId);
    }

    public async Task<bool> UpdateField(Field field, int fieldId)
    {
        return await _fieldRepository.UpdateField(field, fieldId);
    }
}