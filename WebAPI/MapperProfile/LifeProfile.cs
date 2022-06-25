using AutoMapper;
using TheLiveLogic.DataStruct;

namespace WebAPI.APIStruct.Mapper;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<Field, FieldResponse>();

        CreateMap<Field, FieldInfoResponse>()
            .ForMember(
                response => response.MinimapBase64,
                option => option.Ignore());

        CreateMap<SetFieldRequest, Field>()
            .ForMember(
                response => response.Id,
                option => option.Ignore());

    }
}