using Microsoft.AspNetCore.Mvc;
using TheLiveLogic.Interfaces;
using WebAPI.APIStruct;

namespace WebAPI.Controllers;

[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("Registration")]
    public async Task<IActionResult> RegisterNewUser()
    {
        var newUserId = await _userService.AddUser("anonymous");
        
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
            return Ok(HttpContext.User.Claims.Select(c => new UserClaimResponse {Key = c.Type, Value = c.Value}));
        }
    }
}