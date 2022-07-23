using System.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using TheLifeServices.Services;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace WebAPI.SignalR;

public class TheLifeSimulationHub : Hub<IFieldSimulationClient>
{
    private readonly ISimulationService _simulationService;

    public TheLifeSimulationHub(ISimulationService simulationService)
    {
        _simulationService = simulationService;
    }

    public async Task SendFields(SimulatedFieldSignalRRequest simulatedFieldRequest)
    {
        var isInProcess = Context.Items.TryAdd("inProcess", null);
        if (!isInProcess) return;

        var isTurnExist = Context.Items.TryGetValue("turn", out var turnValue);
        var currentTurn = ((int?)turnValue) ?? 0;
        
        Context.Items["turn"] = simulatedFieldRequest.ToTurn;
        
        for (var i = currentTurn; i < simulatedFieldRequest.ToTurn; i++)
        {
            var fields = _simulationService.MakeTurn(simulatedFieldRequest.Id);
            await Clients.Caller.FieldsRequest(fields??new List<SimulatedFieldWithOutId>());
        };
        
        Context.Items.Remove("inProcess");
    }
}