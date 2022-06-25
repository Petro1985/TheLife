using System.Data;
using System.Data.Common;
using System.Linq;
using LifeDataBase;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace TheLiveLogic.Test;

internal class MyWebsite : WebApplicationFactory<Program>
{
    private readonly DbConnection _dbConnection;
    
    public MyWebsite()
    {
        _dbConnection = new SqliteConnection("Data Source=:memory:");
        _dbConnection.Open();

    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        base.CreateHost(builder);

        builder.ConfigureServices(collection =>
        {
            var serviceToDelete =
                collection.FirstOrDefault(q => q.ServiceType == typeof(DbContextOptions<FieldContext>));
            collection.Remove(serviceToDelete);
            collection.AddScoped<DbContextOptions<FieldContext>>(provider =>
            {
                var builder = new DbContextOptionsBuilder<FieldContext>();

                builder.UseApplicationServiceProvider(provider);
                builder.UseSqlite(_dbConnection);

                return builder.Options;
            });
        });
        var hostResult = builder.Build();

        using var scope = hostResult.Services.CreateScope(); 
        var dbContext = scope.ServiceProvider.GetRequiredService<FieldContext>();
        
        dbContext.Database.EnsureCreated();

        return hostResult;
    }

    protected override void Dispose(bool disposing)
    {
        if ((_dbConnection.State & ConnectionState.Open) != 0) _dbConnection.Close();
        base.Dispose(disposing);
    }
}