using System.Collections.Immutable;
using System.Text.Json;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic.Maps;

namespace LifeDataBase;

public class FieldContext : DbContext
{
    public DbSet<FieldEntity> LifeStates { get; set; }
    public DbSet<UserEntity> LifeUsers { get; set; }

    public FieldContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>().HasMany<FieldEntity>(entity => entity.Lifes).WithOne();

        modelBuilder.Entity<FieldEntity>().Property(state => state.Survivors)
            .HasConversion(
                list => JsonSerializer.Serialize(list, (JsonSerializerOptions?)null), 
                json => JsonSerializer.Deserialize<ImmutableList<Coord>>(json, (JsonSerializerOptions?)null)!);
        
        base.OnModelCreating(modelBuilder);
    }

}