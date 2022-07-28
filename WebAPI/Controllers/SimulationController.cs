using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Fields;
using TheLiveLogic.Interfaces;
using WebAPI.APIStruct;

namespace WebAPI.Controllers;

[ApiController]
public class SimulationController : ControllerBase
{
    private readonly IFieldService _fieldService;
    private readonly IMapper _mapper;
    private readonly ISimulationService _simulation;

    public SimulationController(ISimulationService simulation, IMapper mapper, IFieldService fieldService)
    {
        _simulation = simulation;
        _mapper = mapper;
        _fieldService = fieldService;
    }

    /// <summary>
    /// Makes one turn on the simulated field and returns changes
    /// </summary>
    [Authorize]
    [HttpPost("Turn/{count:int}")]         // TODO: change to GET and add several fields in return
    [ProducesResponseType(typeof(SimulatedFieldResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public IActionResult MakeTurn([FromBody]Guid simulatedFieldId, [FromRoute]int count)
    {
        var field = _simulation.MakeTurn(simulatedFieldId, count);

        var response = new SimulatedFieldResponse
        {
            Id = simulatedFieldId,
            Field = field!,
        };
        
        return Ok(response);
    }
    
    /// <summary>
    /// start simulation for specified set of survivors 
    /// </summary>
    [Authorize]
    [HttpPost("StartNewFieldSimulation/")]
    [ProducesResponseType(typeof(SimulatedFieldResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public Task<IActionResult> StartNewFieldSimulation([FromBody] List<Coord> survivors)
    {
        var field = new Field
        {
            Survivors = survivors,
        };
        var newSimulatedFieldId = _simulation.CreateSimulatedField(field);
        var newField = new List<FieldWithoutId>
        {
            new FieldWithoutId {Survivors = field.Survivors},
            new FieldWithoutId {Survivors = _simulation.MakeTurn(newSimulatedFieldId, 1)!.First().Survivors},
        };

        var newSimulatedField = new SimulatedFieldResponse 
        {
            Id = newSimulatedFieldId,
            Field = newField!
        };

        return Task.FromResult<IActionResult>(Ok(newSimulatedField));
    }

    /// <summary>
    /// Delete specific simulation by its id 
    /// </summary>
    [Authorize]
    [HttpDelete("StopFieldSimulation/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public IActionResult StopFieldSimulation([FromBody]Guid simulatedFieldId)
    {
        _simulation.DeleteSimulatedField(simulatedFieldId); 
        
        return Ok();
    }
}