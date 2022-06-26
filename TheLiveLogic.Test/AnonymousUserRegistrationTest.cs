using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using WebAPI.APIStruct;
using Xunit;

namespace TheLiveLogic.Test;

public class AnonymousUserRegistrationTest
{
    private readonly MyWebsite _myWebsite;
    private readonly HttpClient _client;

    public AnonymousUserRegistrationTest()
    {
        _myWebsite = new MyWebsite();
        var clientOptions = new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            MaxAutomaticRedirections = 0,
            HandleCookies = true
        };
        _client = _myWebsite.CreateClient(clientOptions);
    }

    [Fact]
    public async Task AnonymousUser_Should_Be_Able_To_Register()
    {
        await _client.SignUp();
    }

    [Fact]
    public async Task WhoIAm_Should_Return_UserID()
    {
        await _client.SignUp();

        var response = await _client.GetAsync("WhoAmI");
        response.Should().BeSuccessful();
        
        var claims = await response.Content.ReadFromJsonAsync<IEnumerable<UserClaimResponse>>();
        claims.Should().Contain(p => p.Key == "user" && !string.IsNullOrWhiteSpace(p.Value));
    }

    [Fact]
    public async Task WhoIAm_Should_Return_401_WithOutCookie()
    {
        var response = await _client.GetAsync("WhoAmI");
        response.Should().Be401Unauthorized();
    }
}