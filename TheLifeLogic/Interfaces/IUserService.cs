using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IUserService
{
    Task<Guid> AddUser(string name);
    Task<User?> GetUser(Guid id);
}