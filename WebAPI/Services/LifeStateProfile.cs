using AutoMapper;
using LifeDataBase.Entities;
using TheLiveLogic;

namespace WebAPI.Services;

public class LifeStateProfile : Profile
{
    public LifeStateProfile()
    {
        CreateMap<LifeState, FieldEntity>()
            .ForMember(i => i.Survivors, op => op.MapFrom(from => from.Survivors))
            .ForMember(i => i.Id, op => op.Ignore())
            .ForMember(i => i.UserID, op => op.Ignore());
        CreateMap<FieldEntity, LifeState>()
            .ForMember(i => i.Survivors, op => op.MapFrom(from => from.Survivors));
    }
}