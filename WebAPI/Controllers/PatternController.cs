using System.Drawing.Imaging;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Fields;
using TheLiveLogic.Interfaces;
using WebAPI.APIStruct;

namespace WebAPI.Controllers;

public class PatternController : ControllerBase
{

    private readonly IPatternService _patternService;
    private readonly IMinimapGenerator _minimapGenerator;
    private readonly IMapper _mapper;


    public PatternController(IPatternService patternService, IMinimapGenerator minimapGenerator, IMapper mapper)
    {
        _patternService = patternService;
        _minimapGenerator = minimapGenerator;
        _mapper = mapper;
    }

    /// <summary>
    /// Return information about all patterns.
    /// </summary>
    [Authorize]
    [HttpGet("Pattern")]
    [ProducesResponseType(typeof(List<FieldPatternInfoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllPatternsInfo()
    {
        var patterns = await _patternService.GetAllPatterns();

        var patternsResponse = patterns.Select(pattern => _mapper.Map<FieldPatternInfoResponse>(pattern));

        return Ok(patternsResponse);
    }

    
    /// <summary>
    /// Return field of specific pattern.
    /// </summary>
    [Authorize]
    [HttpGet("Pattern/{patternId:long}")]
    [ProducesResponseType(typeof(FieldWithoutId), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPatternById(long patternId)
    {
        var pattern = await _patternService.GetPattern(patternId);
        var response = _mapper.Map<FieldWithoutId>(pattern);
        
        return Ok(response);
    }    
    
    /// <summary>
    /// Saves a new field in database and assigns id
    /// </summary>
    /// <param name="newPattern"></param>
    [Authorize]
    [HttpPost("Pattern")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<IActionResult> AddPattern([FromBody] AddPatternRequest newPattern)
    {
        var mappedPattern = _mapper.Map<FieldPattern>(newPattern);

        using var stream = _minimapGenerator.Generate(newPattern.Survivors, 300);
        stream.Position = 0;
        
        mappedPattern.PreviewBase64 = Convert.ToBase64String(stream.ToArray());
        
        var patternId = await _patternService.AddPattern(mappedPattern);
        
        return Ok(patternId);
    }
}