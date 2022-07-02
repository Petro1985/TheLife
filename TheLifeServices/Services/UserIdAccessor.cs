//using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Http;
using TheLiveLogic.Interfaces;

namespace TheLifeServices.Services;

public class UserIdAccessor : IUserIdAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserIdAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? GetUserId()
    {
        var userId = _httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(i => i.Type == "user")?.Value;
        var result = Guid.TryParse(userId, out var userGuid);
        return result ? userGuid : null;
    }
}