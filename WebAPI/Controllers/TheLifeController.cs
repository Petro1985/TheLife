using System.Drawing.Imaging;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLiveLogic;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;
using WebAPI.APIStruct;

namespace WebAPI.Controllers;

[ApiController]
public class TheLifeController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IFieldService _fieldService;
    private readonly IUserIdAccessor _userIdAccessor;
    private readonly ISimulatedFieldService _simulatedField;
    private readonly IMinimapGenerator _minimapGenerator;
    
    public TheLifeController(IFieldService fieldService, IUserIdAccessor userIdAccessor, IMapper mapper, ISimulatedFieldService simulatedField, IMinimapGenerator minimapGenerator)
    {
        _mapper = mapper;
        _simulatedField = simulatedField;
        _minimapGenerator = minimapGenerator;
        _fieldService = fieldService;
        _userIdAccessor = userIdAccessor;
    }

    
    /// <summary>
    /// Returns minimap of specific field
    /// </summary>
    /// <param name="fieldId">Field Id witch minimap you need</param>
    [Authorize]
    [HttpGet("Minimap/{fieldId:int}")]
    [ProducesResponseType(typeof(MemoryStream), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetMinimap(int fieldId)
    {
        var field = await _fieldService.LoadField(fieldId);
        if (field is null)
        {
            return BadRequest($"There is no field with Id == {fieldId}");
        }

        var minimap = _minimapGenerator.Generate(field.Survivors);
        var stream = new MemoryStream();
        minimap.Save(stream, ImageFormat.Png);
        stream.Position = 0;
            
        return File(stream, "image/png");
    }

    /// <summary>
    /// Returns field by id
    /// </summary>
    /// <param name="fieldId">Id of field you need</param>
    [Authorize]
    [HttpGet("Map/{fieldId:int}")]
    [ProducesResponseType(typeof(FieldResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetField(int fieldId)
    {
        var field = await _fieldService.LoadField(fieldId);
        if (field is null)
            return BadRequest($"There is no field with Id == {fieldId}");

        var mappedField = _mapper.Map<FieldResponse>(field);
        return Ok(mappedField);
    }

    /// <summary>
    /// Return information about all field belongs to authenticated user.
    /// </summary>
    [Authorize]
    [HttpGet("Map")]
    [ProducesResponseType(typeof(List<FieldInfoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserFields()
    {
        var fields = await _fieldService.LoadAllFields();
        
        var responseFields = fields.Select(field =>
        {
            var mappedField = _mapper.Map<FieldInfoResponse>(field);
            using var stream = new MemoryStream();
            
            _minimapGenerator.Generate(field.Survivors).Save(stream,  ImageFormat.Png);
            stream.Position = 0;
            
            mappedField.MinimapBase64 = Convert.ToBase64String(stream.ToArray());
            
            return mappedField;
        }).ToList();
        
        return Ok(responseFields);
    }

    /// <summary>
    /// Saves a new field in database and assigns id
    /// </summary>
    /// <param name="field"></param>
    [Authorize]
    [HttpPost("Map")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<IActionResult> SaveNewMap([FromBody] SetFieldRequest field)
    {
        var mappedState = _mapper.Map<Field>(field);
        var mapId = await _fieldService.SaveField(mappedState);
        
        return Ok(mapId);
    }

    /// <summary>
    /// Updates field information in database
    /// </summary>
    /// <param name="field"></param>
    /// <param name="fieldId">id of field to update</param>
    [Authorize]
    [HttpPut("Map/{fieldId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SaveMap([FromBody] SetFieldRequest field, [FromRoute] int fieldId)
    {
        var mappedState = _mapper.Map<Field>(field);
        var result = await _fieldService.UpdateField(mappedState, fieldId);
        if (!result) return BadRequest($"There is no field with id {fieldId}"); 
        
        return Ok();
    }

    /// <summary>
    /// Makes one turn on the simulated field and returns changes
    /// </summary>
    [Authorize]
    [HttpPost("Turn/{simulatedFieldId}")]
    [ProducesResponseType(typeof(SimulatedFieldResponse), StatusCodes.Status200OK)]
    public IActionResult MakeTurn(int simulatedFieldId)
    {
        var user = _userIdAccessor.GetUserId()!;
        
        var field = _simulatedField.MakeTurn(user.Value, simulatedFieldId);
        var mappedField = _mapper.Map<SimulatedFieldResponse>(field);
        
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
        var user = _userIdAccessor.GetUserId()!.Value;

        var field = await _fieldService.LoadField(fieldId);
        if (field is null) return BadRequest($"There is no field with id={fieldId}");
        
        field.Id = _simulatedField.CreateSimulatedField(user, field); 
        
        return Ok(_mapper.Map<SimulatedFieldResponse>(field));
    }

    /// <summary>
    /// Delete specific simulation by its id 
    /// </summary>
    [Authorize]
    [HttpDelete("StopFieldSimulation/{simulatedFieldId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public IActionResult StopFieldSimulation(int simulatedFieldId)
    {
        var user = _userIdAccessor.GetUserId()!.Value;
        _simulatedField.DeleteSimulatedField(user, simulatedFieldId); 
        
        return Ok();
    }
    
    /// <summary>
    /// Delete specific field from database 
    /// </summary>
    [Authorize]
    [HttpDelete("Map/{fieldId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteField(int fieldId)
    {
        var field = await _fieldService.DeleteField(fieldId);
        if (!field) return BadRequest($"Couldn't delete field id={field} by some reason");
        
        return Ok();
    }
    
    /// <summary>
    /// Rename field 
    /// </summary>
    [Authorize]
    [HttpPut("UpdateFieldName/{fieldId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeFieldName(int fieldId, [FromQuery]string newName)
    {
        var field = await _fieldService.UpdateFieldName(fieldId, newName);
        if (!field) return BadRequest($"Couldn't rename field id={field} by some reason");
        return Ok();
    }
}