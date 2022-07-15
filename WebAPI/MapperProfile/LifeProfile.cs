using AutoMapper;
using TheLiveLogic.DataStruct;
using WebAPI.APIStruct;

namespace WebAPI.MapperProfile;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<Field, FieldResponse>();

        CreateMap<Field, SimulatedFieldResponse>();

        CreateMap<SimulatedField, SimulatedFieldResponse>();
        
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