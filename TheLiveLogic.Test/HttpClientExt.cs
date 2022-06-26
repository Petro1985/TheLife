using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;

namespace TheLiveLogic.Test;

public static class HttpClientExt
{
    public static async Task SignUp(this HttpClient client)
    {
        var response = await client.PostAsync("Registration", null);
        response.Should().BeSuccessful();
    }
}
 