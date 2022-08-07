FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TheLifePatternsLoader/TheLifePatternsLoader.csproj", "TheLifePatternsLoader/"]
COPY ["LifeDataBase/LifeDataBase.csproj", "LifeDataBase/"]
COPY ["TheLifeLogic/TheLifeLogic.csproj", "TheLifeLogic/"]
COPY ["TheLifeServices/TheLifeServices.csproj", "TheLifeServices/"]
RUN dotnet restore "TheLifePatternsLoader/TheLifePatternsLoader.csproj"
COPY . .
WORKDIR "/src/TheLifePatternsLoader"
RUN dotnet build "TheLifePatternsLoader.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TheLifePatternsLoader.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
#COPY PatternsLoader/Patterns /app/Patterns

ENTRYPOINT ["dotnet", "TheLifePatternsLoader.dll"]
