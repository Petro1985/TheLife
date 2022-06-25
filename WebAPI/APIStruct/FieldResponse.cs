using System.Collections.Immutable;
using System.Drawing;
using TheLiveLogic.Maps;

namespace WebAPI.APIStruct;

public class FieldResponse
{
    public long Id { get; init; }
    public ImmutableList<Coord> Survivors { get; set; }
}