using AutoMapper;
using LifeDataBase;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic;
using WebAPI.Services;

namespace WebAPI.Repositories;

public interface IFieldRepository
{
    Task<long> SaveField(Field state);
    Task<List<Field>> LoadAllFields();
    Task<Field?> LoadField(int fieldId);
    Task UpdateField(Field state, int fieldId);
}

public class FieldRepository : IFieldRepository
{
    private readonly LifeContext _db;
    private readonly IMapper _mapper;
    private readonly UserIdAccessor _userIdAccessor;
    
    public FieldRepository(LifeContext db, IMapper mapper, UserIdAccessor userIdAccessor)
    {
        _db = db;
        _mapper = mapper;
        _userIdAccessor = userIdAccessor;
    }

    public async Task<long> SaveField(Field state)
    {
        
        var lifeState = new FieldEntity
        {
            Survivors = state.Survivors,
            UserEntityId = _userIdAccessor.GetUserId()!.Value,
        };

        _db.LifeStates.Add(lifeState);
        await _db.SaveChangesAsync();
        
        return lifeState.Id;
    }

    public async Task<List<Field>> LoadAllFields()
    {
        var userId = _userIdAccessor.GetUserId()!.Value;
        var query = _db.LifeStates.Where(
            entity => entity.UserEntityId == userId);
        
        var mappedQuery = _mapper.ProjectTo<Field>(query, new {});

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