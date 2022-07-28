using TheLiveLogic.DataStruct;
using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class SimulatedFieldResponse
{
    public Guid Id { get; set; }
    public List<FieldWithoutId> Field { get; set; }
}