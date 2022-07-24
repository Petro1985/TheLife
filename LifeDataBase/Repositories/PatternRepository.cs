using AutoMapper;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic.DataStruct;
using TheLiveLogic.Interfaces;

namespace LifeDataBase.Repositories;

public class PatternRepository : IPatternRepository
{
    private readonly FieldContext _dbContext;
    private readonly IMapper _mapper; 


    public PatternRepository(FieldContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<FieldPattern> GetFieldPattern(long id)
    {
        var patternEntity = await _dbContext.Patterns.FirstAsync(entity => entity.Id == id);
        var pattern = _mapper.Map<FieldPattern>(patternEntity);
        return pattern;
    }

    public async Task<List<FieldPattern>> GetAllFieldPatterns()
    {
        var patterns = await _mapper.ProjectTo<FieldPattern>(_dbContext.Patterns).ToListAsync();
        return patterns;
    }

    public async Task<long> AddPattern(FieldPattern pattern)
    {
        var patternEntity = _mapper.Map<PatternEntity>(pattern);
        _dbContext.Patterns.Add(patternEntity);
        await _dbContext.SaveChangesAsync();
        
        return patternEntity.Id;
    }
}
