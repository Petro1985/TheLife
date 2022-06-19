using TheLiveLogic.Maps;

namespace TheLiveLogic;

public class TheLife
{
    public IMap Map { set; get; }
    private readonly LifeEngine _lifeEngine;

    public TheLife(IMap map, LifeEngine lifeEngine)
    {
        Map = map;
        _lifeEngine = lifeEngine;
    }

    public Field MakeTurn()
    {
        _lifeEngine.MakeTurn(Map);
        return Map.GetState();
    }

    
}