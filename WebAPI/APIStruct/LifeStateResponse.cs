using TheLiveLogic.Maps;

namespace WebAPI.APIStruct;

public class LifeStateResponse
{
    public List<Coord> Survivors { get; set; } = new List<Coord>();
}