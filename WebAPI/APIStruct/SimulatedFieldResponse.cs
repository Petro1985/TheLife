using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class SimulatedFieldResponse
{
    public Guid Id { get; set; }
    public List<Coord> Survivors { get; set; }
}