using System.Collections;
using Microsoft.Extensions.DependencyInjection;
using TheLiveLogic.Maps;

namespace TheLiveLogic;

public static class ServiceCollectionExt
{
    public static IServiceCollection AddTheLife(this IServiceCollection collection)
    {
        // collection.AddScoped<TheLife>();
        // collection.AddSingleton<LifeEngine>();
        // collection.AddScoped<IMap, EndlessMap>();
        return collection;
    }
}
