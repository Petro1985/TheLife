using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace TheLifeServices.Services;

public class PatternService : IPatternService
{
    private readonly IPatternRepository _patternRepository;

    public PatternService(IPatternRepository patternRepository)
    {
        _patternRepository = patternRepository;
    }

    public async Task<List<FieldPattern>> GetAllPatterns()
    {
        return await _patternRepository.GetAllFieldPatterns();
    }

    public async Task<FieldPattern> GetPattern(long id)
    {
        return await _patternRepository.GetFieldPattern(id);
    }

    public async Task<long> AddPattern(FieldPattern fieldPattern)
    {
        return await _patternRepository.AddPattern(fieldPattern);
    }
}