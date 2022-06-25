using System.Collections.Immutable;
using TheLiveLogic.Maps;

namespace TheLiveLogic;

public class Field
{
    public long Id { get; set; }
    public ImmutableList<Coord> Survivors { get; }

    public Field(IEnumerable<Coord> survivors)
    {
        
        Survivors = survivors.ToImmutableList();
    }

    private Field()
    {
    }

    public Field(ImmutableList<Coord> survivors)
    {
        Survivors = survivors;
    }
}