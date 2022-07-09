using TheLiveLogic.Fields;

namespace TheLiveLogic.DataStruct;

public class Field
{
    public long Id { get; set; }
    public List<Coord> Survivors { get; set; }

    public string Name { get; set; }

    public Field(IEnumerable<Coord> survivors)
    {
        
        Survivors = survivors.ToList();
    }

    private Field()
    {
    }

    public Field(List<Coord> survivors)
    {
        Survivors = survivors;
    }
}