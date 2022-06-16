using AutoMapper;
using TheLiveLogic;
using WebAPI.Controllers;

namespace WebAPI.APIStruct.Mapper;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<LifeState, LifeStateResponse>()
            .ForMember(
                response => response.Survivors,
                option => option.MapFrom(
                    ls => ls.Survivors))
            .ReverseMap();
        
        CreateMap<LifeState, SetStateRequest>()
            .ForMember(
                response => response.Survivors,
                option => option.MapFrom(
                    ls => ls.Survivors))
            .ReverseMap();
    }
}