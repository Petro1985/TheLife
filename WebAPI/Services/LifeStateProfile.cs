using AutoMapper;
using LifeDataBase.Entities;
using TheLiveLogic;

namespace WebAPI.Services;

public class LifeStateProfile : Profile
{
    public LifeStateProfile()
    {
        CreateMap<Field, FieldEntity>()
            .ForMember(i => i.Survivors, op => op.MapFrom(from => from.Survivors))
            .ForMember(i => i.Id, op => op.Ignore())
            .ForMember(i => i.UserEntityId, op => op.Ignore());
        CreateMap<FieldEntity, Field>()
            .ForMember(i => i.Survivors, op => op.MapFrom(from => from.Survivors))
            .ForMember(x => x.Id, op => op.MapFrom(x => x.Id));
    }
}