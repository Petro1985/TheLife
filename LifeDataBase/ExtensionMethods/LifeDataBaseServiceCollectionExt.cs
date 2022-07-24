using System.Reflection;
using LifeDataBase.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic;
using TheLiveLogic;
using TheLiveLogic.Interfaces;

namespace LifeDataBase.ExtensionMethods;

public static class LifeDataBaseServiceCollectionExt
{
    public static IServiceCollection AddTheLifeDataBase(this IServiceCollection collection)
    {
        collection.AddScoped<IUserRepository, UserRepository>();
        collection.AddScoped<IFieldRepository, FieldRepository>();
        collection.AddScoped<IPatternRepository, PatternRepository>();
        collection.AddAutoMapper(Assembly.GetAssembly(typeof(FieldContext)));
        return collection;
    }
}
