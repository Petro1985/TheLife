using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class SetFieldRequest
{
    public List<Coord> Survivors { get; set; } = new List<Coord>();
    public string Name { get; set; }
}