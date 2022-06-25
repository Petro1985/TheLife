using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using WebAPI.Repositories;
using WebAPI.Services;

namespace WebAPI.Controllers;

[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost("Registration")]
    public async Task<IActionResult> RegisterNewUser()
    {
        var newUserId = await _userRepository.AddUser();
        HttpContext.Response.Cookies.Append("user", newUserId.ToString(),
            new CookieOptions {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.MaxValue,
            });
        
        return Ok();
    }

    
    [HttpGet("WhoAmI")]
    public IActionResult WhoTheyAre()
    {
        if (HttpContext.User.Identity!.IsAuthenticated == false)
        {
            return Unauthorized();
        }
        else
        {
            return Ok(HttpContext.User.Claims.Select(c => new {Key = c.Type, Value = c.Value}));
        }
    }
}