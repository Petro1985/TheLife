using TheLiveLogic.DataStruct;

namespace TheLiveLogic.Interfaces;

public interface IPatternRepository
{
    public Task<FieldPattern> GetFieldPattern(long id);
    public Task<List<FieldPattern>> GetAllFieldPatterns();
    public Task<long> AddPattern(FieldPattern pattern);
}