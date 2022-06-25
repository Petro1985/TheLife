using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using WebAPI.APIStruct;

namespace TheLiveLogic.Test;

public static class HttpClientExt
{
    public static async Task SignUp(this HttpClient client)
    {
        var response = await client.PostAsync("Registration", null);
        response.Should().BeSuccessful();
    }
}
 