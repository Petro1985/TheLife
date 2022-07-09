using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class FieldResponse
{
    public long Id { get; init; }
    public string Name { get; set; }
    public List<Coord> Survivors { get; set; }
}

public class SimulatedFieldResponse
{
    public long SimulatedFieldId { get; init; }
    public List<Coord> Survivors { get; set; }
}