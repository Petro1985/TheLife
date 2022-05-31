namespace TheLiveLogic;

public class TheLife
{
    public IMap Map { set; get; }
    private LifeEngine _lifeEngine;

    public TheLife(IMap map, LifeEngine lifeEngine)
    {
        Map = map;
        _lifeEngine = lifeEngine;
    }

    public LifeState MakeTurn(LifeState startState = null)
    {
        _lifeEngine.MakeTurn(Map);

        return Map.GetState();
    }

    
}