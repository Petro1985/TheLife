using AutoMapper;
using TheLiveLogic.DataStruct;
using WebAPI.APIStruct;

namespace WebAPI.MapperProfile;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<Field, FieldResponse>();
        
        CreateMap<Field, SimulatedFieldResponse>()
            .ForMember(prop => prop.SimulatedFieldId, 
                opt => opt.MapFrom(propFrom => propFrom.Id));
        
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