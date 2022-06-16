namespace WebAPI.Services;

public class UserId
{
    public Guid Value { get; init; }

    public UserId(Guid value)
    {
        Value = value;
    }
}

public class UserIdAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserIdAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public UserId? GetUserId()
    {
        var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(i => i.Type == "user")?.Value;
        var result = Guid.TryParse(userId, out var userGuid);
        return result ? new UserId(userGuid) : null;
    }
}

