using System.Reflection;
using LifeDataBase;
using LifeDataBase.ExtensionMethods;
using LifeDataBase.Repositories;
using Microsoft.EntityFrameworkCore;
using TheLifeServices.ExtensionMethods;
using TheLifeServices.Services;
using TheLiveLogic;
using TheLiveLogic.ExtensionMethods;
using TheLiveLogic.Interfaces;
using WebAPI.Auth;
using WebAPI.Controllers;
using WebAPI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(conf =>
    {
        conf.WithOrigins("http://localhost:3000", "https://localhost:3000", "https://localhost:7129");
        conf.AllowAnyHeader();
        conf.AllowAnyMethod();
        conf.AllowCredentials();
    });
});

// Aplication services registration
builder.Services.AddTheLifeDataBase();
builder.Services.AddTheLifeLogic();
builder.Services.AddTheLifeServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IUserIdAccessor, UserIdAccessor>();
builder.Services.AddSingleton<IActiveFieldService, ActiveFieldService>();
builder.Services.AddSingleton<IMinimapGenerator, MinimapGenerator>();


builder.Services.AddAuthentication(opt =>
{
    opt.AddScheme<UserAuth>("user_auth", "");
    opt.DefaultScheme = "user_auth";
});

builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(Program)));

builder.Services.AddDbContext<FieldContext>(options =>
{
    var connectionString = builder.Configuration["DB_Settings:connectionstring"];
    connectionString += $"password={builder.Configuration["DBPassword"]};";
    options.UseNpgsql(connectionString);
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(Program)));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

