using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    [HttpPost("Turn/")]         // TODO: change to GET and add several fields in return
    [ProducesResponseType(typeof(SimulatedFieldResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public IActionResult MakeTurn([FromBody]Guid simulatedFieldId)
    {
        var field = _simulation.MakeTurn(simulatedFieldId);
        var mappedField = _mapper.Map<SimulatedFieldResponse>(field);
        if (mappedField is null) return BadRequest("Simulated field expired");
        
        return Ok(mappedField);
    }
    
    /// <summary>
    /// Set specific field as an simulated one 
    /// </summary>
    [Authorize]
    [HttpPost("StartNewFieldSimulation/{fieldId:int}")]
    [ProducesResponseType(typeof(SimulatedFieldResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StartNewFieldSimulation(int fieldId)
    {
        var field = await _fieldService.LoadField(fieldId);
        if (field is null) return BadRequest($"There is no field with id={fieldId}");
        
        var newSimulatedFieldId = _simulation.CreateSimulatedField(field);

        var newSimulatedField = new SimulatedFieldResponse 
        {
            Id = newSimulatedFieldId,
            Survivors = field.Survivors
        };

        return Ok(newSimulatedField);
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