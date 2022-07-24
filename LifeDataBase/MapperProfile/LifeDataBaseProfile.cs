using AutoMapper;
using LifeDataBase.Entities;
using TheLiveLogic.DataStruct;

namespace LifeDataBase.MapperProfile;

public class LifeDataBaseProfile : Profile
{
    public LifeDataBaseProfile()
    {
        CreateMap<FieldPattern, PatternEntity>();
        CreateMap<PatternEntity, FieldPattern>();

        CreateMap<Field, FieldEntity>()
            .ForMember(i => i.UserEntityId, op => op.Ignore());
        CreateMap<FieldEntity, Field>();

        CreateMap<User, UserEntity>()
            .ForMember(i => i.Lifes, op => op.Ignore());
        CreateMap<UserEntity, User>();
    }
}