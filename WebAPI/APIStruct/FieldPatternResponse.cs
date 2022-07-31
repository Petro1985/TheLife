using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class FieldPatternResponse
{
    public long Id { get; set; }
    public List<Coord> Survivors { get; set; }
}