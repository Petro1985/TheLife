using AutoMapper;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace LifeDataBase.Repositories;

public class FieldRepository : IFieldRepository
{
    private readonly FieldContext _db;
    private readonly IUserIdAccessor _userIdAccessor;
    private readonly IMapper _mapper; 
    
    public FieldRepository(FieldContext db, IUserIdAccessor userIdAccessor, IMapper mapper)
    {
        _db = db;
        _userIdAccessor = userIdAccessor;
        _mapper = mapper;
    }

    public async Task<long> SaveField(Field field)
    {
        var fieldEntity = _mapper.Map<FieldEntity>(field);
        fieldEntity.UserEntityId = _userIdAccessor.GetUserId()!.Value;

        _db.LifeStates.Add(fieldEntity);
        await _db.SaveChangesAsync();
        
        return fieldEntity.Id;
    }

    public async Task<List<Field>> LoadAllFields()
    {
        var userId = _userIdAccessor.GetUserId()!.Value;
        var query = _db.LifeStates.Where(
            entity => entity.UserEntityId == userId);
        var mappedQuery = _mapper.ProjectTo<Field>(query);
        
        return await mappedQuery.ToListAsync();
    }

    public async Task<Field?> LoadField(int fieldId)
    {
        var field = await _db.LifeStates.
            FirstOrDefaultAsync(
                entity => entity.Id == fieldId 
                && entity.UserEntityId == _userIdAccessor.GetUserId());
        
        var mappedFiled = _mapper.Map<Field>(field);
        return mappedFiled;
    }

    public async Task<bool> UpdateField(Field state, int fieldId)
    {
        var field = await _db.LifeStates.FirstOrDefaultAsync(entity => entity.Id == fieldId);
        if (field is null) return false;
        
        field.Survivors = state.Survivors;
        _db.LifeStates.Update(field);
        await _db.SaveChangesAsync();
        return true;
    }
}