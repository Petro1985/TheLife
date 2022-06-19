using AutoMapper;
using TheLiveLogic;
using WebAPI.Controllers;

namespace WebAPI.APIStruct.Mapper;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<Field, LifeStateResponse>()
            .ForMember(
                response => response.Survivors,
                option => option.MapFrom(
                    ls => ls.Survivors))
            .ReverseMap();
        
        CreateMap<Field, SetStateRequest>()
            .ForMember(
                response => response.Survivors,
                option => option.MapFrom(
                    ls => ls.Survivors))
            .ReverseMap();
    }
}