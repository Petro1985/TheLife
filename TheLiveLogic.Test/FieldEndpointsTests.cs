using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using TheLiveLogic.Fields;
using WebAPI.APIStruct;
using Xunit;

namespace TheLiveLogic.Test;

public class FieldEndpointsTests
{
    private readonly MyWebsite _myWebsite;
    private readonly HttpClient _client;

    public FieldEndpointsTests()
    {
        _myWebsite = new MyWebsite();
        _client = _myWebsite.CreateClient();
    }

    [Fact]
    public async Task FieldsEndPoints()
    {
        var field = new SetFieldRequest
        {
            Name = "Field",
            Survivors = new List<Coord>
            {
                new Coord(3, 3),
                new Coord(4, 4),
                new Coord(4, 5),
                new Coord(3, 5),
                new Coord(2, 5),
            }};
        var fieldId = await PostField(field);
        
        var response = await _client.GetAsync($"Map/{fieldId}");
        response.Should().BeSuccessful();
        var fieldResponse = await response.Content.ReadFromJsonAsync<FieldResponse>();

        fieldResponse.Should().BeEquivalentTo(field);
    }


    private async Task<int> PostField(SetFieldRequest request)
    {
        var response = await _client.PostAsJsonAsync("/Map", request);
        response.Should().BeSuccessful();
        var fieldId = await response.Content.ReadFromJsonAsync<int>();

        return fieldId;
    }

}