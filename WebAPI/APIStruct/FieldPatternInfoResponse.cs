using TheLiveLogic.Fields;

namespace WebAPI.APIStruct;

public class FieldPatternInfoResponse
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string PreviewBase64 { get; set; }
    public DateTime LastChange { get; set; }
}

public class FieldPatternResponse
{
    public long Id { get; set; }
    public List<Coord> Survivors { get; set; }
}