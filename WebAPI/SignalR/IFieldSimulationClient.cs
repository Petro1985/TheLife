using TheLiveLogic.DataStruct;

namespace WebAPI.SignalR;

public interface IFieldSimulationClient
{
    Task FieldsRequest(List<SimulatedFieldWithOutId> fields);
}