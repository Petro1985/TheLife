using System.Drawing.Imaging;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLiveLogic;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;
using WebAPI.APIStruct;
using WebAPI.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
public class TheLifeController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IFieldService _fieldService;
    private readonly IUserIdAccessor _userIdAccessor;
    private readonly IActiveFieldService _activeField;
    private readonly IMinimapGenerator _minimapGenerator;
    
    public TheLifeController(IFieldService fieldService, IUserIdAccessor userIdAccessor, IMapper mapper, IActiveFieldService activeField, IMinimapGenerator minimapGenerator)
    {
        _mapper = mapper;
        _activeField = activeField;
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
    /// Returns only "state of life" in specified area
    /// </summary>
    /// <param name="x"></param>
    /// <param name="y"></param>
    /// <param name="dX"></param>
    /// <param name="dY"></param>
    [Authorize]
    [HttpGet("Map/Area", Name = "GetAreaState")]
    [ProducesResponseType(typeof(FieldResponse), StatusCodes.Status200OK)]
    public IActionResult GetSquareState([FromQuery]int x, [FromQuery]int y, [FromQuery]int dX, [FromQuery]int dY)
    {
        var user = _userIdAccessor.GetUserId()!;
        var resultLife = _activeField.GetActiveFieldRect(user.Value, new Rect(x, y, dX, dY));
        var mappedResult = _mapper.Map<FieldResponse>(resultLife);
        
        return Ok(mappedResult);
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
    /// Makes one turn on active field and returns changes
    /// </summary>
    [Authorize]
    [HttpPost("Turn/")]
    [ProducesResponseType(typeof(FieldResponse), StatusCodes.Status200OK)]
    public IActionResult MakeTurn()
    {
        var user = _userIdAccessor.GetUserId()!;
        
        var field = _activeField.MakeTurn(user.Value);
        var mappedField = _mapper.Map<FieldResponse>(field);
        
        return Ok(mappedField);
    }
    
    /// <summary>
    /// Set specific field as an active one 
    /// </summary>
    [Authorize]
    [HttpPost("SetFieldForSimulation/{id:int}")]
    [ProducesResponseType(typeof(FieldResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SetFieldForSimulation(int id)
    {
        var user = _userIdAccessor.GetUserId()!.Value;

        var field = await _fieldService.LoadField(id);
        if (field is null) return BadRequest($"There is no field with id={id}");
        
        _activeField.SetActiveField(user, field);
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