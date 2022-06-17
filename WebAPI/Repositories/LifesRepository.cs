using AutoMapper;
using LifeDataBase;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic;
using WebAPI.Services;

namespace WebAPI.Repositories;

public interface IFieldRepository
{
    Task<long> SaveField(LifeState state);
    Task<List<LifeState>> LoadAllFields();
    Task<LifeState?> LoadField(int fieldId);
    Task UpdateField(LifeState state, int fieldId);
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

    public async Task<long> SaveField(LifeState state)
    {
        
        var lifeState = new FieldEntity
        {
            Survivors = state.Survivors,
            UserID = _userIdAccessor.GetUserId()!.Value,
        };

        _db.LifeStates.Add(lifeState);
        await _db.SaveChangesAsync();
        
        return lifeState.Id;
    }

    public async Task<List<LifeState>> LoadAllFields()
    {
        var userId = _userIdAccessor.GetUserId()!.Value;
        var query = _db.LifeStates.Where(
            entity => entity.UserID == userId);
        
        var mappedQuery = _mapper.ProjectTo<LifeState>(query, new {});

        var result = await mappedQuery.ToListAsync();
        
        return result;
    }

    public async Task<LifeState?> LoadField(int fieldId)
    {
        var field = await _db.LifeStates.FirstOrDefaultAsync(entity => entity.Id == fieldId);
        var mappedFiled = _mapper.Map<LifeState>(field);
        
        return mappedFiled;
    }

    public async Task UpdateField(LifeState state, int fieldId)
    {
        var field = await _db.LifeStates.FirstOrDefaultAsync(entity => entity.Id == fieldId);
        if (field is null) return;
        
        field.Survivors = state.Survivors;
        _db.LifeStates.Update(field);
        await _db.SaveChangesAsync();
    }
}