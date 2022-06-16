using System.Collections.Immutable;
using TheLiveLogic.Maps;

namespace TheLiveLogic;

public class LifeState
{
    
    public ImmutableList<Coord> Survivors { get; }

    public LifeState(IEnumerable<Coord> survivors)
    {
        
        Survivors = survivors.ToImmutableList();
    }

    private LifeState()
    {
    }

    public LifeState(ImmutableList<Coord> survivors)
    {
        Survivors = survivors;
    }
}