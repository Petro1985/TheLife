using AutoMapper;
using TheLiveLogic.DataStruct;
using WebAPI.APIStruct;

namespace WebAPI.MapperProfile;

public class LifeProfile : Profile
{
    public LifeProfile()
    {
        CreateMap<FieldPattern, FieldWithoutId>();
        
        CreateMap<AddPatternRequest, FieldPattern>();
        CreateMap<FieldPattern, FieldPatternInfoResponse>();
        CreateMap<FieldPattern, FieldPatternResponse>();
        
        CreateMap<Field, FieldResponse>();
        CreateMap<Field, SimulatedFieldResponse>();
        CreateMap<Field, FieldInfoResponse>()
            .ForMember(
                response => response.MinimapBase64,
                option => option.Ignore());

        CreateMap<SimulatedField, SimulatedFieldResponse>();

        CreateMap<SetFieldRequest, Field>()
            .ForMember(
                response => response.Id,
                option => option.Ignore());
    }
}