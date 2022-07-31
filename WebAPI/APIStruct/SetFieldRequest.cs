using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class SetFieldRequest
{
    public List<Coord> Survivors { get; set; }
    public string Name { get; set; }
}