using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IUserRepository
{
    Task<Guid> AddUser(string name);
    Task<User?> GetUser(Guid id);
}