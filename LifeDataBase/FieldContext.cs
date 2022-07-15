using System.Collections.Immutable;
using System.Text.Json;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic.Fields;

namespace LifeDataBase;

public class FieldContext : DbContext
{
    public DbSet<FieldEntity> LifeStates { get; set; }
    public DbSet<UserEntity> LifeUsers { get; set; }

    public FieldContext(DbContextOptions options) : base(options)
    {
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        // auto-filling LastChange column with DateTime.UtcNow
        var objectStateEntries = ChangeTracker.Entries()
            .Where(e => e.Entity is FieldEntity && e.State is EntityState.Modified or EntityState.Added).ToList();
        
        var currentTime = DateTime.UtcNow;
        
        foreach (var entry in objectStateEntries)
        {
            var entityBase = entry.Entity as FieldEntity;
            if (entityBase == null) continue;
            entityBase.LastChange = currentTime;
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<UserEntity>().HasMany<FieldEntity>(entity => entity.Lifes).WithOne();

        modelBuilder.Entity<FieldEntity>().Property(state => state.Survivors)
            .HasConversion(
                list => JsonSerializer.Serialize(list, (JsonSerializerOptions?)null), 
                json => JsonSerializer.Deserialize<List<Coord>>(json, (JsonSerializerOptions?)null)!);
        
        base.OnModelCreating(modelBuilder);
    }

}