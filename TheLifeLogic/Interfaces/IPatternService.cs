using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IPatternService
{
    public Task<List<FieldPattern>> GetAllPatterns();
    public Task<FieldPattern> GetPattern(long id);
    public Task<long> AddPattern(FieldPattern fieldPattern);
}