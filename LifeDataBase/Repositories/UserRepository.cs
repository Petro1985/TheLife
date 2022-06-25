using AutoMapper;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace LifeDataBase.Repositories;

public class UserRepository : IUserRepository
{
    private readonly FieldContext _db;
    private readonly IMapper _mapper; 

    public UserRepository(FieldContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<Guid> AddUser(string name)
    {
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Name = name,
        };
        
        _db.LifeUsers.Add(user);
        await _db.SaveChangesAsync();

        return user.Id;
    }

    public async Task<User?> GetUser(Guid id)
    {
        var user = await _db.LifeUsers.FirstOrDefaultAsync(user => user.Id == id);
        return _mapper.Map<User>(user);
    }
}