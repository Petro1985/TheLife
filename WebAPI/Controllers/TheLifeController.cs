using System.Drawing;
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

    [Authorize]
    [HttpGet("Minimap/{fieldId:int}")]
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

    [Authorize]
    [HttpGet("Map/{fieldId:int}", Name = "GetCurrentState")]
    public async Task<IActionResult> GetField(int fieldId)
    {
        var field = await _fieldService.LoadField(fieldId);

        if (field is null)
        {
            return BadRequest($"There is no field with Id == {fieldId}");
        }

        return Ok(field);
    }

    [Authorize]
    [HttpGet("Map", Name = "Get user fields")]
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

    [Authorize]
    [HttpGet("Map/Area", Name = "GetAreaState")]
    public IActionResult GetSquareState([FromQuery]int x, [FromQuery]int y, [FromQuery]int dX, [FromQuery]int dY)
    {
        var user = _userIdAccessor.GetUserId()!;
        var resultLife = _activeField.GetActiveFieldRect(user.Value, new Rect(x, y, dX, dY));
        return Ok(resultLife);
    }

    [Authorize]
    [HttpPost("Map", Name = "SaveMap")]
    public async Task<IActionResult> SaveNewMap([FromBody] SetFieldRequest field)
    {
        var mappedState = _mapper.Map<Field>(field);
        var mapId = await _fieldService.SaveField(mappedState);
        
        return Ok(mapId);
    }

    [Authorize]
    [HttpPut("Map/{mapId}", Name = "SaveNewMap")]
    public async Task<IActionResult> SaveMap([FromBody] SetFieldRequest field, [FromRoute] int mapId)
    {
        var mappedState = _mapper.Map<Field>(field);
        await _fieldService.UpdateField(mappedState, mapId);
        
        return Ok();
    }

    [Authorize]
    [HttpPost("Turn/{numberOfTurns:int}", Name = "Make_N_Turns")]
    public IActionResult MakeTurn(int numberOfTurns = 1)
    {
        var user = _userIdAccessor.GetUserId()!;
        
        for (var i = 0; i < numberOfTurns; i++)
            _activeField.MakeTurn(user.Value);
        
        return Ok();
    }
}