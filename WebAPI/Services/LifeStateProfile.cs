using AutoMapper;
using LifeDataBase.Entities;
using TheLiveLogic;

namespace WebAPI.Services;

public class LifeStateProfile : Profile
{
    public LifeStateProfile()
    {
        base.CreateMap<LifeState, FieldEntity>()
            .ForMember(i => i.Survivors, op => op.MapFrom(from => from.Survivors))
            .ForMember(i => i.Id, op => op.Ignore())
            .ForMember(i => i.User, op => op.Ignore());
    }
}