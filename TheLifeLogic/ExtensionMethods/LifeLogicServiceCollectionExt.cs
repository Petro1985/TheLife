using Microsoft.Extensions.DependencyInjection;
using TheLiveLogic.Maps;

namespace TheLiveLogic.ExtensionMethods;

public static class LifeLogicServiceCollectionExt
{
    public static IServiceCollection AddTheLifeLogic(this IServiceCollection collection)
    {
        collection.AddSingleton<LifeEngine>();
        return collection;
    }
}
