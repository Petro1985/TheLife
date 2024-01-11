using System.Reflection;
using LifeDataBase;
using LifeDataBase.ExtensionMethods;
using Microsoft.EntityFrameworkCore;
using TheLifeServices.ExtensionMethods;
using TheLifeServices.Services;
using TheLiveLogic.ExtensionMethods;
using TheLiveLogic.Interfaces;
using WebAPI.Auth;
using WebAPI.Middleware;
using WebAPI.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureAppConfiguration(conf =>
{
    conf.AddEnvironmentVariables();
});

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt => 
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    opt.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(conf =>
    {
        conf.WithOrigins("http://localhost:44447", "http://localhost:5129");
        conf.AllowAnyHeader();
        conf.AllowAnyMethod();
        conf.AllowCredentials();
    });
});

// Application services registration
builder.Services.AddMemoryCache();
builder.Services.AddTheLifeDataBase();
builder.Services.AddTheLifeLogic();
builder.Services.AddTheLifeServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IUserIdAccessor, UserIdAccessor>();

builder.Services.AddAuthentication(opt =>
{
    opt.AddScheme<UserAuth>("user_auth", "");
    opt.DefaultScheme = "user_auth";
});

builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(Program)));

builder.Services.AddDbContext<FieldContext>(options =>
{
    var connectionString = builder.Configuration["DB_Settings:connectionString"];
    options.UseNpgsql(connectionString);
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(Program)));


var app = builder.Build();

app.UsePathBase("/life");
app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<TheLifeSimulationHub>("/SimulationHub");
app.MapControllers();
app.MapFallbackToFile("index.html");

app.UseStaticFiles();

app.UseMiddleware<RouteLoggerMiddleware>();
app.Run();

