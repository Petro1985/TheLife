using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class AddPatternRequest
{
    public List<Coord> Survivors { get; set; }
    public string Name { get; set; }
    public string Discription { get; set; }
}