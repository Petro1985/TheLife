using AutoMapper;
using LifeDataBase.Entities;
using TheLiveLogic;
using WebAPI.Controllers;

namespace WebAPI.APIStruct.Mapper;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<FieldEntity, FieldResponse>()
            .ForMember(i => i.Minimap, opt => opt.Ignore());
        
        CreateMap<Field, FieldResponse>()
            .ForMember(
                response => response.Survivors,
                option => option.MapFrom(
                    ls => ls.Survivors))
            .ReverseMap();
        
        CreateMap<Field, SetFieldRequest>()
            .ForMember(
                response => response.Survivors,
                option => option.MapFrom(
                    ls => ls.Survivors))
            .ReverseMap();
    }
}