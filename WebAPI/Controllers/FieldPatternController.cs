using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLiveLogic.Interfaces;
using WebAPI.APIStruct;

namespace WebAPI.Controllers;

public class FieldPatternController : ControllerBase
{

    private readonly IPatternService _patternService;
    private readonly IMinimapGenerator _minimapGenerator;
    private readonly IMapper _mapper;


    public FieldPatternController(IPatternService patternService, IMinimapGenerator minimapGenerator, IMapper mapper)
    {
        _patternService = patternService;
        _minimapGenerator = minimapGenerator;
        _mapper = mapper;
    }

    /// <summary>
    /// Return information about all patterns.
    /// </summary>
    [Authorize]
    [HttpGet("Patterns")]
    [ProducesResponseType(typeof(List<FieldPatternInfoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllPatternsInfo()
    {
        var patterns = await _patternService.GetAllPatterns();

        var patternsResponse = patterns.Select(pattern => _mapper.Map<FieldPatternInfoResponse>(pattern));

        return Ok(patternsResponse);
    }
    
    // /// <summary>
    // /// Saves a new field in database and assigns id
    // /// </summary>
    // /// <param name="field"></param>
    // [Authorize]
    // [HttpPost("Map")]
    // [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    // public async Task<IActionResult> SaveNewMap([FromBody] SetFieldRequest field)
    // {
    //     var mappedState = _mapper.Map<Field>(field);
    //     var mapId = await _fieldService.SaveField(mappedState);
    //     
    //     return Ok(mapId);
    // }
    //
    // /// <summary>
    // /// Updates field information in database
    // /// </summary>
    // /// <param name="field"></param>
    // /// <param name="fieldId">id of field to update</param>
    // [Authorize]
    // [HttpPut("Map/{fieldId}")]
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    // public async Task<IActionResult> SaveMap([FromBody] SetFieldRequest field, [FromRoute] int fieldId)
    // {
    //     var mappedState = _mapper.Map<Field>(field);
    //     var result = await _fieldService.UpdateField(mappedState, fieldId);
    //     if (!result) return BadRequest($"There is no field with id {fieldId}"); 
    //     
    //     return Ok();
    // }
    
    
    // /// <summary>
    // /// Delete specific field from database 
    // /// </summary>
    // [Authorize]
    // [HttpDelete("Map/{fieldId}")]
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    // public async Task<IActionResult> DeleteField(int fieldId)
    // {
    //     var field = await _fieldService.DeleteField(fieldId);
    //     if (!field) return BadRequest($"Couldn't delete field id={field} by some reason");
    //     
    //     return Ok();
    // }
}