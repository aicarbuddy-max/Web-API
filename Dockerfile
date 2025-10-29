FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj files and restore
COPY src/CarBuddy.Domain/*.csproj ./src/CarBuddy.Domain/
COPY src/CarBuddy.Application/*.csproj ./src/CarBuddy.Application/
COPY src/CarBuddy.Infrastructure/*.csproj ./src/CarBuddy.Infrastructure/
COPY src/CarBuddy.API/*.csproj ./src/CarBuddy.API/

RUN dotnet restore src/CarBuddy.API/CarBuddy.API.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/CarBuddy.API/CarBuddy.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Render uses port 10000 by default
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "CarBuddy.API.dll"]
