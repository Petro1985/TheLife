using System.Collections.Immutable;

namespace TheLiveLogic;

public class LifeState
{
    public ImmutableList<(int x, int y)> Survivors { get; }

    public LifeState(IEnumerable<(int x, int y)> survivors)
    {
        Survivors = survivors.ToImmutableList();
    }
    
}