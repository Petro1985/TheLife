using System.Collections.Concurrent;
using System.Drawing;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLiveLogic;
using TheLiveLogic.Maps;
using WebAPI.APIStruct;
using WebAPI.Repositories;
using WebAPI.Services;

namespace WebAPI.Controllers;

[ApiController]
public class TheLifeController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IFieldRepository _fieldRepository;
    private readonly UserIdAccessor _userIdAccessor;
    private readonly ActiveFieldService _activeField;
    
    public TheLifeController(IFieldRepository fieldRepository, UserIdAccessor userIdAccessor, IMapper mapper, ActiveFieldService activeField)
    {
        _mapper = mapper;
        _activeField = activeField;
        _fieldRepository = fieldRepository;
        _userIdAccessor = userIdAccessor;
    }

    [HttpGet("Map/{fieldId:int}", Name = "GetCurrentState")]
    public async Task<IActionResult> GetField(int fieldId)
    {
        var field = await _fieldRepository.LoadField(fieldId);

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
        var fields = await _fieldRepository.LoadAllFields();

        return Ok(fields);
    }

    [Authorize]
    [HttpGet("Map/Area", Name = "GetAreaState")]
    public IActionResult GetSquareState([FromQuery]int x, [FromQuery]int y, [FromQuery]int dX, [FromQuery]int dY)
    {
        var user = _userIdAccessor.GetUserId();
        var resultLife = _activeField.GetActiveFieldRect(user!, new Rect(x, y, dX, dY));
        return Ok(resultLife);
    }

    [HttpPost("Map", Name = "SaveMap")]
    public async Task<IActionResult> SaveNewMap([FromBody] SetStateRequest state)
    {
        var mappedState = _mapper.Map<Field>(state);
        var mapId = await _fieldRepository.SaveField(mappedState);
        
        return Ok(mapId);
    }

    [HttpPut("Map/{mapId}", Name = "SaveNewMap")]
    public async Task<IActionResult> SaveMap([FromBody] SetStateRequest state, [FromRoute] int mapId)
    {
        var mappedState = _mapper.Map<Field>(state);
        await _fieldRepository.UpdateField(mappedState, mapId);
        
        return Ok();
    }

    [Authorize]
    [HttpPost("Turn/{numberOfTurns:int}", Name = "Make_N_Turns")]
    public IActionResult MakeTurn(int numberOfTurns = 1)
    {
        var user = _userIdAccessor.GetUserId();
        
        for (var i = 0; i < numberOfTurns; i++)
            _activeField.MakeTurn(user!);
        
        return Ok();
    }
}

public class ActiveFieldService
{
    private readonly ConcurrentDictionary<UserId, IMap> _activeField;
    private readonly LifeEngine _lifeEngine;

    public ActiveFieldService(LifeEngine lifeEngine)
    {
        _lifeEngine = lifeEngine;
        _activeField = new ConcurrentDictionary<UserId, IMap>();
    }

    public Field MakeTurn(UserId userId)
    {
        var map = _activeField.GetValueOrDefault(userId);
        if (map is null) return new Field(new List<Coord>());
        _lifeEngine.MakeTurn(map);
        return map.GetState();
    }

    public Field GetActiveField(UserId userId)
    {
        var map = _activeField.GetValueOrDefault(userId);
        if (map is null) return new Field(new List<Coord>());
        return map.GetState();
    }

    public void SetActiveField(UserId userId, Field field)
    {
        IMap map = new EndlessMap();
        map.SetState(field);

        _activeField.AddOrUpdate(userId, map, (_, _) => map);
    }

    public Field GetActiveFieldRect(UserId userId, Rect rect)
    {
        var map = _activeField.GetValueOrDefault(userId);
        return map is null ? new Field(new List<Coord>()) : map.GetSquareState(rect);
    }
}



