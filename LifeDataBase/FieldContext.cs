﻿using System.Text.Json;
using LifeDataBase.Entities;
using Microsoft.EntityFrameworkCore;
using TheLiveLogic.Fields;

namespace LifeDataBase;

public class FieldContext : DbContext
{
    public DbSet<FieldEntity> LifeStates { get; set; }
    public DbSet<UserEntity> LifeUsers { get; set; }
    public DbSet<PatternEntity> Patterns { get; set; }
    
    public FieldContext(DbContextOptions options) : base(options)
    {
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new ())
    {
        // auto-filling LastChange column with DateTime.UtcNow
        var objectStateEntries = ChangeTracker.Entries()
            .Where(e => e.Entity is FieldEntity or PatternEntity  && e.State is EntityState.Modified or EntityState.Added).ToList();
        
        var currentTime = DateTime.UtcNow;
        
        foreach (var entry in objectStateEntries)
        {
            entry.Property("LastChange").CurrentValue = currentTime;
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PatternEntity>().Property(state => state.Survivors)
            .HasConversion(
                list => JsonSerializer.Serialize(list, (JsonSerializerOptions?)null), 
                json => JsonSerializer.Deserialize<List<Coord>>(json, (JsonSerializerOptions?)null)!);

        modelBuilder.Entity<UserEntity>().HasMany<FieldEntity>(entity => entity.Lifes).WithOne();

        modelBuilder.Entity<FieldEntity>().Property(state => state.Survivors)
            .HasConversion(
                list => JsonSerializer.Serialize(list, (JsonSerializerOptions?)null), 
                json => JsonSerializer.Deserialize<List<Coord>>(json, (JsonSerializerOptions?)null)!);
        
        base.OnModelCreating(modelBuilder);
    }

}