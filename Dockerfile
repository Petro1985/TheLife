FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 7129
EXPOSE 5129
EXPOSE 44447
ENV ASPNETCORE_URLS="http://0.0.0.0:5129"
#ENV DOTNET_GENERATE_ASPNET_CERTIFICATE=false

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /src
COPY WebAPI/WebAPI.csproj WebAPI/
COPY ["LifeDataBase/LifeDataBase.csproj", "LifeDataBase/"]
COPY ["TheLifeLogic/TheLifeLogic.csproj", "TheLifeLogic/"]
COPY ["TheLifeServices/TheLifeServices.csproj", "TheLifeServices/"]
RUN dotnet restore "WebAPI/WebAPI.csproj"

#RUN dotnet dev-certs https --clean
#RUN dotnet dev-certs https --trust

COPY . .
WORKDIR "/src/WebAPI"
RUN dotnet build "WebAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAPI.dll"]
