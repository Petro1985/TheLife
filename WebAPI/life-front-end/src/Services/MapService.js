
export class MapService
{
    currentMap;
    setMap;

    constructor(setMapFunc, map)
    {
    }

    SetNewMap(map)
    {
        this.currentMap = map;
    }

    ApplyCurrentMap()
    {
        this.setMap(this.currentMap);
    }

    ChangeLife(x, y)
    {
        const newMap = {};
        newMap.id = this.currentMap.id;
        newMap.name = this.currentMap.name;

        newMap.survivors = this.currentMap.survivors.filter(life => !(life.x === x && life.y === y));

        if (newMap.survivors.length === this.currentMap.survivors.length)
        {
            newMap.survivors.push({x:x, y:y});
        }
        this.currentMap = newMap;
    }
}