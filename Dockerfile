FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5129

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

ARG REACT_APP_SERVER_ADDRESS="http://localhost:5129"
ARG REACT_APP_BASE_PATH="/life"
ENV REACT_APP_SERVER_ADDRESS=${REACT_APP_SERVER_ADDRESS}
ENV REACT_APP_BASE_PATH=${REACT_APP_BASE_PATH}

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY WebAPI/WebAPI.csproj WebAPI/
COPY LifeDataBase/LifeDataBase.csproj LifeDataBase/
COPY TheLifeLogic/TheLifeLogic.csproj TheLifeLogic/
COPY TheLifeServices/TheLifeServices.csproj TheLifeServices/

RUN dotnet restore "WebAPI/WebAPI.csproj"
COPY . .

WORKDIR "/src/WebAPI"
RUN dotnet build "WebAPI.csproj" -c Release -o /app/build

FROM build AS publish
WORKDIR "/src/WebAPI"
RUN dotnet publish "WebAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "WebAPI.dll"]
