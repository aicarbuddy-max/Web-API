# CarBuddy - Vehicle Service Directory API

A production-ready .NET 8 Web API built with Clean Architecture principles for managing garages, services, and auto parts shops.

## Architecture

This project follows Clean Architecture with clear separation of concerns:

```
CarBuddy/
├── src/
│   ├── CarBuddy.Domain/          # Entities, Value Objects, Enums
│   ├── CarBuddy.Application/     # DTOs, Interfaces, Business Logic
│   ├── CarBuddy.Infrastructure/  # EF Core, Repositories, External Services
│   └── CarBuddy.API/             # Controllers, Middleware, Program.cs
```

### Layer Dependencies
- **Domain**: No dependencies (core business entities)
- **Application**: Depends on Domain
- **Infrastructure**: Depends on Application and Domain
- **API**: Depends on Infrastructure, Application, and Domain

## Features

- JWT-based authentication and authorization
- Clean Architecture with proper separation of concerns
- Repository pattern with Unit of Work
- PostgreSQL database support (Supabase-ready)
- Swagger/OpenAPI documentation with JWT authorization
- Global exception handling middleware
- Async/await pattern throughout
- CORS support for frontend integration

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- PostgreSQL database (local or Supabase)
- Visual Studio 2022 / VS Code / JetBrains Rider (optional)

## Getting Started

### 1. Clone and Restore

```bash
git clone <repository-url>
cd "car buddy"
dotnet restore
```

### 2. Configure Database Connection

#### For Local PostgreSQL:
Update `src/CarBuddy.API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=carbuddy_dev;Username=postgres;Password=your_password"
  }
}
```

#### For Supabase:
Update `src/CarBuddy.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.your-project.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your_supabase_password;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

Get your Supabase credentials from:
1. Go to your Supabase project
2. Settings → Database
3. Copy the connection string

### 3. Update JWT Secret Key

Update the `SecretKey` in `appsettings.json` (must be at least 32 characters):
```json
{
  "JwtSettings": {
    "SecretKey": "YourUniqueSecretKeyHere_AtLeast32Characters!",
    "Issuer": "CarBuddyAPI",
    "Audience": "CarBuddyClients",
    "ExpiryMinutes": "60"
  }
}
```

### 4. Install EF Core Tools (if not already installed)

```bash
dotnet tool install --global dotnet-ef
```

### 5. Create Database Migration

```bash
cd src/CarBuddy.API
dotnet ef migrations add InitialCreate --project ../CarBuddy.Infrastructure --startup-project .
```

### 6. Apply Migration to Database

```bash
dotnet ef database update --project ../CarBuddy.Infrastructure --startup-project .
```

### 7. Run the Application

```bash
dotnet run --project src/CarBuddy.API
```

The API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`
- Swagger UI: `https://localhost:7001` (root)

## API Endpoints

### Authentication (Public)
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token

### Garages (Protected)
- `GET /api/garages` - Get all garages
- `GET /api/garages/{id}` - Get garage by ID
- `POST /api/garages` - Create new garage
- `PUT /api/garages/{id}` - Update garage
- `DELETE /api/garages/{id}` - Delete garage

### Services (Protected)
- `GET /api/services` - Get all services
- `GET /api/services/{id}` - Get service by ID
- `GET /api/services/garage/{garageId}` - Get services by garage
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

### Auto Parts Shops (Protected)
- `GET /api/autopartsshops` - Get all auto parts shops
- `GET /api/autopartsshops/{id}` - Get shop by ID
- `POST /api/autopartsshops` - Create new shop
- `PUT /api/autopartsshops/{id}` - Update shop
- `DELETE /api/autopartsshops/{id}` - Delete shop

## Using Swagger UI

1. Navigate to `https://localhost:7001` after running the application
2. Register a new user via `POST /api/users/register`
3. Login via `POST /api/users/login` and copy the JWT token
4. Click "Authorize" button at the top right
5. Enter: `Bearer YOUR_TOKEN_HERE`
6. Now you can access all protected endpoints

## Testing with cURL

### Register a User
```bash
curl -X POST https://localhost:7001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Login
```bash
curl -X POST https://localhost:7001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Create a Garage (with JWT token)
```bash
curl -X POST https://localhost:7001/api/garages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John's Auto Repair",
    "address": "123 Main St, City",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "rating": 4.5
  }'
```

## Database Schema

### Users
- Id (Guid, PK)
- Username (string, unique)
- Email (string, unique)
- PasswordHash (string)
- Role (enum: User, Admin)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)

### Garages
- Id (Guid, PK)
- Name (string)
- Address (string)
- Latitude (double)
- Longitude (double)
- Rating (decimal)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)

### Services
- Id (Guid, PK)
- GarageId (Guid, FK)
- Name (string)
- Description (string)
- Price (decimal)
- CreatedAt (DateTime)

### AutoPartsShops
- Id (Guid, PK)
- Name (string)
- Address (string)
- Latitude (double)
- Longitude (double)
- Rating (decimal)
- CreatedAt (DateTime)
- UpdatedAt (DateTime?)

## Project Structure Details

### Domain Layer
Contains core business entities and enums. No external dependencies.

### Application Layer
- **DTOs**: Data Transfer Objects for API requests/responses
- **Interfaces**: Service and repository abstractions
- **Services**: Business logic implementation

### Infrastructure Layer
- **Data**: EF Core DbContext
- **Repositories**: Generic repository and Unit of Work pattern
- **Services**: JWT token generation

### API Layer
- **Controllers**: RESTful API endpoints
- **Middleware**: Global exception handling
- **Program.cs**: Dependency injection and configuration

## Switching Databases

To switch from PostgreSQL to another database:

1. Replace the Npgsql package in `CarBuddy.Infrastructure.csproj`
2. Update the `UseNpgsql` call in `Program.cs` to use the new provider
3. Update the connection string format in `appsettings.json`
4. Create a new migration and apply it

Example for SQL Server:
```bash
dotnet remove package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

Update Program.cs:
```csharp
options.UseSqlServer(connectionString)
```

## Common Commands

### Build the solution
```bash
dotnet build
```

### Run tests (when tests are added)
```bash
dotnet test
```

### Create a new migration
```bash
dotnet ef migrations add MigrationName --project src/CarBuddy.Infrastructure --startup-project src/CarBuddy.API
```

### Rollback migration
```bash
dotnet ef database update PreviousMigrationName --project src/CarBuddy.Infrastructure --startup-project src/CarBuddy.API
```

### Remove last migration
```bash
dotnet ef migrations remove --project src/CarBuddy.Infrastructure --startup-project src/CarBuddy.API
```

## Security Considerations

- Always use HTTPS in production
- Change the JWT secret key to a strong, random value
- Use environment variables for sensitive configuration
- Enable CORS only for trusted domains in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use proper password policies

## Future Enhancements

- [ ] Add unit and integration tests
- [ ] Implement refresh tokens
- [ ] Add role-based authorization
- [ ] Implement pagination for list endpoints
- [ ] Add search and filtering capabilities
- [ ] Implement caching (Redis)
- [ ] Add logging with Serilog
- [ ] Implement API versioning
- [ ] Add health checks
- [ ] Container support (Docker)

## License

This project is provided as-is for educational and commercial use.

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.
