using TheLiveLogic.Maps;

namespace WebAPI.APIStruct;

public class FieldResponse
{
    public long Id { get; init; }
    public string Name { get; set; }
    public List<Coord> Survivors { get; set; }
}