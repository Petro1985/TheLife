using System.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using TheLifeServices.Services;
using TheLiveLogic.Interfaces;

namespace WebAPI.SignalR;

public class SimulatedFieldRequest
{
    public Guid Id { set; get; }
    public int ToTurn { get; set; }
}
public class TheLifeSimulationHub : Hub
{
    private readonly ISimulationService _simulationService;

    public TheLifeSimulationHub(ISimulationService simulationService)
    {
        _simulationService = simulationService;
    }

    public async Task SendMessage(SimulatedFieldRequest simulatedFieldRequest)
    {
        var isInProcess = Context.Items.TryAdd("inProcess", null);
        if (!isInProcess) return;

        var isTurnExist = Context.Items.TryGetValue("turn", out var turnValue);
        var currentTurn = ((int?)turnValue) ?? 0;
        
        Context.Items["turn"] = simulatedFieldRequest.ToTurn;
        
        for (var i = currentTurn; i < simulatedFieldRequest.ToTurn; i++)
        {
            var nextTurn = _simulationService.MakeTurn(simulatedFieldRequest.Id);
            await Clients.Caller.SendAsync("ReceiveMessage", nextTurn);
        };
        
        Context.Items.Remove("inProcess");
    }
}