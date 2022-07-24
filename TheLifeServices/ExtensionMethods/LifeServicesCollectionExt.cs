using Microsoft.Extensions.DependencyInjection;
using TheLifeServices.Services;
using TheLiveLogic.Interfaces;

namespace TheLifeServices.ExtensionMethods;

public static class LifeServicesCollectionExt
{
    public static IServiceCollection AddTheLifeServices(this IServiceCollection collection)
    {
        collection.AddScoped<IUserService, UserService>();
        collection.AddScoped<IFieldService, FieldService>();
        collection.AddScoped<IPatternService, PatternService>();
        collection.AddSingleton<IMinimapGenerator, MinimapGenerator>();
        collection.AddSingleton<ISimulationService, SimulationService>();
        return collection;
    }
}
