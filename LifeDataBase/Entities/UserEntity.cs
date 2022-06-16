namespace LifeDataBase.Entities;

public class UserEntity
{
    public Guid Id { get; init; }
    public string Name { get; set; }

    public List<FieldEntity> Lifes { get; set; }
}