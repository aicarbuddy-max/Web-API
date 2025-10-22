# Project Structure

Complete folder structure of the CarBuddy API project:

```
CarBuddy/
│
├── CarBuddy.sln                          # Solution file
├── README.md                             # Full documentation
├── CLAUDE.md                             # Architecture guidance for Claude Code
├── QUICKSTART.md                         # 5-minute quick start guide
├── STRUCTURE.md                          # This file
├── .gitignore                            # Git ignore rules
│
└── src/
    │
    ├── CarBuddy.Domain/                  # Domain Layer (Core Business Entities)
    │   ├── Common/
    │   │   └── BaseEntity.cs             # Base entity with Id, CreatedAt, UpdatedAt
    │   ├── Entities/
    │   │   ├── User.cs                   # User entity
    │   │   ├── Garage.cs                 # Garage entity
    │   │   ├── Service.cs                # Service entity (belongs to Garage)
    │   │   └── AutoPartsShop.cs          # Auto parts shop entity
    │   ├── Enums/
    │   │   └── UserRole.cs               # User role enum (User, Admin)
    │   └── CarBuddy.Domain.csproj
    │
    ├── CarBuddy.Application/             # Application Layer (Business Logic)
    │   ├── DTOs/
    │   │   ├── Auth/
    │   │   │   ├── RegisterRequestDto.cs
    │   │   │   ├── LoginRequestDto.cs
    │   │   │   └── AuthResponseDto.cs
    │   │   ├── Garage/
    │   │   │   ├── GarageDto.cs
    │   │   │   ├── CreateGarageDto.cs
    │   │   │   └── UpdateGarageDto.cs
    │   │   ├── Service/
    │   │   │   ├── ServiceDto.cs
    │   │   │   ├── CreateServiceDto.cs
    │   │   │   └── UpdateServiceDto.cs
    │   │   └── AutoPartsShop/
    │   │       ├── AutoPartsShopDto.cs
    │   │       ├── CreateAutoPartsShopDto.cs
    │   │       └── UpdateAutoPartsShopDto.cs
    │   ├── Interfaces/
    │   │   ├── IRepository.cs            # Generic repository interface
    │   │   ├── IUnitOfWork.cs            # Unit of work pattern interface
    │   │   ├── IAuthService.cs           # Auth service interface
    │   │   ├── IJwtService.cs            # JWT token service interface
    │   │   ├── IGarageService.cs         # Garage service interface
    │   │   ├── IServiceService.cs        # Service service interface
    │   │   └── IAutoPartsShopService.cs  # Auto parts shop service interface
    │   ├── Services/
    │   │   ├── AuthService.cs            # Authentication & registration logic
    │   │   ├── GarageService.cs          # Garage business logic
    │   │   ├── ServiceService.cs         # Service business logic
    │   │   └── AutoPartsShopService.cs   # Auto parts shop business logic
    │   └── CarBuddy.Application.csproj
    │
    ├── CarBuddy.Infrastructure/          # Infrastructure Layer (Data Access)
    │   ├── Data/
    │   │   └── ApplicationDbContext.cs   # EF Core DbContext
    │   ├── Repositories/
    │   │   ├── Repository.cs             # Generic repository implementation
    │   │   └── UnitOfWork.cs             # Unit of work implementation
    │   ├── Services/
    │   │   └── JwtService.cs             # JWT token generation
    │   ├── Migrations/                   # EF Core migrations (created at runtime)
    │   └── CarBuddy.Infrastructure.csproj
    │
    └── CarBuddy.API/                     # API Layer (Presentation)
        ├── Controllers/
        │   ├── UsersController.cs        # Auth endpoints (register, login)
        │   ├── GaragesController.cs      # Garage CRUD endpoints
        │   ├── ServicesController.cs     # Service CRUD endpoints
        │   └── AutoPartsShopsController.cs # Auto parts shop CRUD endpoints
        ├── Middleware/
        │   └── GlobalExceptionHandlerMiddleware.cs # Global error handling
        ├── Properties/
        │   └── launchSettings.json       # Launch configuration
        ├── appsettings.json              # Production configuration
        ├── appsettings.Development.json  # Development configuration
        ├── Program.cs                    # Application entry point & DI setup
        └── CarBuddy.API.csproj
```

## Layer Responsibilities

### Domain (CarBuddy.Domain)
- **Purpose**: Core business entities and domain logic
- **Dependencies**: None
- **Contains**: Entities, Value Objects, Enums, Domain Events
- **Rule**: Should never reference other projects

### Application (CarBuddy.Application)
- **Purpose**: Business logic and application services
- **Dependencies**: Domain
- **Contains**: DTOs, Interfaces, Service implementations, Business rules
- **Rule**: Should not know about databases or external services

### Infrastructure (CarBuddy.Infrastructure)
- **Purpose**: Data access and external service integration
- **Dependencies**: Application, Domain
- **Contains**: EF Core, Repositories, External API clients, File I/O
- **Rule**: Implements interfaces defined in Application layer

### API (CarBuddy.API)
- **Purpose**: HTTP endpoints and request/response handling
- **Dependencies**: Infrastructure, Application (for DI only)
- **Contains**: Controllers, Middleware, Configuration
- **Rule**: Thin layer that delegates to Application services

## Key Files

### Configuration
- `appsettings.json` - Production settings (Supabase connection)
- `appsettings.Development.json` - Development settings (local DB)

### Entry Point
- `Program.cs` - DI container setup, middleware pipeline, JWT config

### Database
- `ApplicationDbContext.cs` - EF Core context with entity configurations
- `Migrations/` - Database schema versions (auto-generated)

### Authentication
- `JwtService.cs` - Generates JWT tokens
- `AuthService.cs` - Handles registration and login logic
- `GlobalExceptionHandlerMiddleware.cs` - Catches and formats errors

## Adding New Features

When adding a new entity (e.g., "Booking"):

1. Create `Booking.cs` in `Domain/Entities/`
2. Add DbSet to `ApplicationDbContext`
3. Create DTOs in `Application/DTOs/Booking/`
4. Create `IBookingService` in `Application/Interfaces/`
5. Implement `BookingService` in `Application/Services/`
6. Create `BookingsController` in `API/Controllers/`
7. Register service in `Program.cs` DI
8. Create and apply migration

## Database Migrations

Migrations are stored in `Infrastructure/Migrations/` and created via:
```bash
dotnet ef migrations add MigrationName --project src/CarBuddy.Infrastructure --startup-project src/CarBuddy.API
```

## Build Output

Compiled assemblies are output to:
- `src/{Project}/bin/Debug/net9.0/`
- `src/{Project}/obj/` (intermediate files)

These directories are ignored by Git (see `.gitignore`).

## NuGet Packages

### Domain
- None (pure business logic)

### Application
- BCrypt.Net-Next (password hashing)

### Infrastructure
- Microsoft.EntityFrameworkCore
- Npgsql.EntityFrameworkCore.PostgreSQL
- Microsoft.EntityFrameworkCore.Design
- Microsoft.AspNetCore.Authentication.JwtBearer

### API
- Swashbuckle.AspNetCore (Swagger/OpenAPI)
- (All infrastructure dependencies transitively)

## Notes

- Keep controllers thin (< 10 lines per action)
- Business logic belongs in services, not controllers
- DTOs validate input with data annotations
- Entities are configured in DbContext, not with attributes
- All async methods use CancellationToken
- Exception handling is centralized in middleware
