using TheLiveLogic.Fields;

namespace TheLiveLogic.DataStruct;

public class SimulatedField 
{
    public Guid Id { get; set; }
    public List<Coord> Survivors { get; set; }
}