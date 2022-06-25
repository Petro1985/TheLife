using AutoMapper;
using LifeDataBase;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic;
using WebAPI.APIStruct;
using WebAPI.Controllers;
using WebAPI.Services;

namespace WebAPI.Repositories;

public interface IFieldRepository
{
    Task<long> SaveField(Field state);
    Task<List<FieldResponse>> LoadAllFields();
    Task<Field?> LoadField(int fieldId);
    Task UpdateField(Field state, int fieldId);
}

public class FieldRepository : IFieldRepository
{
    private readonly FieldContext _db;
    private readonly IMapper _mapper;
    private readonly UserIdAccessor _userIdAccessor;
    
    public FieldRepository(FieldContext db, IMapper mapper, UserIdAccessor userIdAccessor)
    {
        _db = db;
        _mapper = mapper;
        _userIdAccessor = userIdAccessor;
    }

    public async Task<long> SaveField(Field state)
    {
        var fieldEntity = new FieldEntity
        {
            Survivors = state.Survivors,
            UserEntityId = _userIdAccessor.GetUserId()!.Value,
        };

        _db.LifeStates.Add(fieldEntity);
        await _db.SaveChangesAsync();
        
        return fieldEntity.Id;
    }

    public async Task<List<FieldResponse>> LoadAllFields()
    {
        var userId = _userIdAccessor.GetUserId()!.Value;
        var query = _db.LifeStates.Where(
            entity => entity.UserEntityId == userId);
        
        var mappedQuery = _mapper.ProjectTo<FieldResponse>(query, new {});

        var result = await mappedQuery.ToListAsync();
        
        return result;
    }

    public async Task<Field?> LoadField(int fieldId)
    {
        var field = await _db.LifeStates.FirstOrDefaultAsync(entity => entity.Id == fieldId);
        var mappedFiled = _mapper.Map<Field>(field);
        
        return mappedFiled;
    }

    public async Task UpdateField(Field state, int fieldId)
    {
        var field = await _db.LifeStates.FirstOrDefaultAsync(entity => entity.Id == fieldId);
        if (field is null) return;
        
        field.Survivors = state.Survivors;
        _db.LifeStates.Update(field);
        await _db.SaveChangesAsync();
    }
}