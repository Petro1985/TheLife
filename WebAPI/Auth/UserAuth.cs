using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repositories;
using WebAPI.Services;

namespace WebAPI.Auth;

public class UserAuth : IAuthenticationHandler
{
    private string _userIdFromCookie;
    private HttpContext _httpContext;
    private IUserRepository _userRepository;

    public UserAuth(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task InitializeAsync(AuthenticationScheme scheme, HttpContext context)
    {
        _httpContext = context;
        _userIdFromCookie = context.Request.Cookies["user"];
        return Task.CompletedTask;
    }

    public async Task<AuthenticateResult> AuthenticateAsync()
    {
        if (_userIdFromCookie is null)
        {
            return AuthenticateResult.Fail("You are not registered yet");
        }

        Guid.TryParse(_userIdFromCookie, out var userGuidFromCookie);
        var user = await _userRepository.GetUser(userGuidFromCookie);

        if (user is null)
        {
            _httpContext.Response.Cookies.Delete("user");
            return AuthenticateResult.Fail("You are not registered yet");
        }

        var claimsPrincipal = new ClaimsPrincipal();
        var claim = new Claim("user", _userIdFromCookie);
        var identity = new ClaimsIdentity("user_auth");
        identity.AddClaim(claim);
        claimsPrincipal.AddIdentity(identity);

        return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, "user_auth"));
    }

    public Task ChallengeAsync(AuthenticationProperties? properties)
    {
        _httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
        _httpContext.Response.Headers.Add("Answer", "You are not registered yet (from challenge)");
        
        return Task.CompletedTask;
    }

    public Task ForbidAsync(AuthenticationProperties? properties)
    {
        return Task.CompletedTask;
    }
}