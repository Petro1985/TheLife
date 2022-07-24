using TheLiveLogic.Fields;

namespace TheLiveLogic.DataStruct;

public class FieldPattern
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string PreviewBase64 { get; set; }
    public List<Coord> Survivors { get; set; }
}