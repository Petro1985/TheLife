using System.Collections.Immutable;
using TheLiveLogic.Maps;

namespace LifeDataBase.Entities;

public class FieldEntity
{
    public long Id { get; init; }
    public ImmutableList<Coord> Survivors { get; set; }
    public Guid UserEntityId { get; set; }
}