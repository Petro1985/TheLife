using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace TheLifeServices.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;


    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Guid> AddUser(string name)
    {
        return await _userRepository.AddUser(name);
    }

    public async Task<User?> GetUser(Guid id)
    {
        var user = await _userRepository.GetUser(id);
        return user;
    }
}