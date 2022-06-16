using TheLiveLogic.Maps;

namespace WebAPI.APIStruct;

public class SetStateRequest
{
    public List<Coord> Survivors { get; set; } = new List<Coord>();
}