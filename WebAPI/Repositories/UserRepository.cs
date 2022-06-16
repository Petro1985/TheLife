using LifeDataBase;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Repositories;

public interface IUserRepository
{
    Task<Guid> AddUser();
    Task<UserEntity?> GetUser(Guid id);
}

public class UserRepository : IUserRepository
{
    private readonly LifeContext _db;

    public UserRepository(LifeContext db)
    {
        _db = db;
    }

    public async Task<Guid> AddUser()
    {
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Name = "",
        };
        
        _db.LifeUsers.Add(user);
        await _db.SaveChangesAsync();

        return user.Id;
    }

    public async Task<UserEntity?> GetUser(Guid id)
    {
        return await _db.LifeUsers.FirstOrDefaultAsync(user => user.Id == id);
    }
}