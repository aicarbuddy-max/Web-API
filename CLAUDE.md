# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarBuddy is a .NET 8 Web API implementing Clean Architecture for a Vehicle Service Directory. The system manages garages, auto services, auto parts shops, and user authentication.

## Architecture

This project strictly follows Clean Architecture with four distinct layers:

### Layer Structure
1. **Domain** (`CarBuddy.Domain`) - Core entities, no external dependencies
2. **Application** (`CarBuddy.Application`) - Business logic, DTOs, interfaces
3. **Infrastructure** (`CarBuddy.Infrastructure`) - Data access, external services
4. **API** (`CarBuddy.API`) - Web API controllers, middleware, configuration

### Dependency Rules
- Domain has zero dependencies
- Application depends only on Domain
- Infrastructure depends on Application and Domain
- API depends on all layers for DI registration only

When modifying code, **never** violate these dependency rules. Infrastructure should never be referenced from Application, and Domain should remain pure.

## Key Design Patterns

### Repository Pattern with Unit of Work
All data access goes through `IUnitOfWork` which coordinates repositories. When adding new entities:
1. Add entity to Domain layer
2. Add repository property to `IUnitOfWork`
3. Implement in `UnitOfWork.cs`
4. Update `ApplicationDbContext` with new DbSet

### Service Layer Pattern
Business logic lives in Application services (e.g., `GarageService`, `AuthService`). Controllers are thin and delegate to services. When adding features:
1. Create interface in `Application/Interfaces`
2. Implement in `Application/Services`
3. Register in `Program.cs` DI container
4. Inject into controller

### JWT Authentication
- Token generation: `IJwtService` in Infrastructure
- Authentication configured in `Program.cs` with Bearer scheme
- Protected endpoints use `[Authorize]` attribute
- Settings in `appsettings.json` under `JwtSettings`

## Database Configuration

### EF Core Setup
- DbContext: `ApplicationDbContext` in Infrastructure layer
- Connection string: `appsettings.json` → `ConnectionStrings:DefaultConnection`
- Provider: Npgsql (PostgreSQL) but swappable via DI
- Migrations: Run from API project, target Infrastructure project

### Creating Migrations
Always run from project root:
```bash
cd src/CarBuddy.API
dotnet ef migrations add MigrationName --project ../CarBuddy.Infrastructure --startup-project .
dotnet ef database update --project ../CarBuddy.Infrastructure --startup-project .
```

### Entity Configuration
Entity configurations are in `ApplicationDbContext.OnModelCreating()`. When adding entities:
- Define keys, indexes, relationships
- Set string max lengths
- Configure decimal precision
- Set up cascade delete behavior

## Common Development Tasks

### Adding a New Entity
1. Create entity class in `Domain/Entities` inheriting `BaseEntity`
2. Add DbSet to `ApplicationDbContext`
3. Configure in `OnModelCreating()`
4. Create DTOs in `Application/DTOs/{EntityName}/`
5. Create service interface in `Application/Interfaces`
6. Implement service in `Application/Services`
7. Create controller in `API/Controllers`
8. Register service in `Program.cs`
9. Create and apply migration

### Adding New Endpoints
1. Add method to service interface
2. Implement in service class
3. Add controller action with proper HTTP verb attribute
4. Add `[Authorize]` if protected
5. Document with XML comments for Swagger
6. Return appropriate status codes (200, 201, 404, 400, etc.)

### Authentication Flow
1. User registers via `POST /api/users/register`
2. Password hashed with BCrypt
3. User logs in via `POST /api/users/login`
4. JWT token generated and returned
5. Client includes token in `Authorization: Bearer {token}` header
6. Protected endpoints validate token via middleware

## Important Conventions

### Async/Await
All I/O operations are async. Always:
- Use `async Task<T>` for methods
- Pass `CancellationToken` parameters
- Await database operations
- Use `ToListAsync()`, `FindAsync()`, etc.

### Error Handling
Global exception handling in `GlobalExceptionHandlerMiddleware`:
- `UnauthorizedAccessException` → 401
- `InvalidOperationException` → 400
- `KeyNotFoundException` → 404
- Everything else → 500

Controllers should let exceptions bubble up to middleware.

### DTOs and Mapping
- Request DTOs: `Create{Entity}Dto`, `Update{Entity}Dto`
- Response DTOs: `{Entity}Dto`
- Manual mapping in services (no AutoMapper currently)
- Validation attributes on DTOs (`[Required]`, `[Range]`, etc.)

### Naming Conventions
- Interfaces: `I{Name}Service`, `I{Name}Repository`
- Services: `{Entity}Service`
- Controllers: `{Entity}Controller` (plural for collections)
- Async methods: `{Action}Async`

## Configuration Files

### appsettings.json (Production)
- Connection string for production database (Supabase)
- JWT secret (must be 32+ characters)
- Should use environment variables for secrets

### appsettings.Development.json
- Local PostgreSQL connection
- Debug logging level
- Development-specific settings

## Testing Strategy (Future)

When adding tests:
- Unit tests: Test services in isolation with mocked repositories
- Integration tests: Test API endpoints with in-memory database
- Test project structure mirrors src structure
- Use xUnit, FluentAssertions, Moq

## Swagger Configuration

Swagger is configured in `Program.cs`:
- JWT Bearer auth integrated
- XML comments enabled for documentation
- Swagger UI at root path in development
- Use XML summary comments on controller actions

## Security Notes

- Passwords hashed with BCrypt (BCrypt.Net-Next)
- JWT tokens expire based on `JwtSettings:ExpiryMinutes`
- CORS configured with `AllowAll` policy (restrict in production)
- HTTPS enforced via `UseHttpsRedirection()`
- Database connection uses SSL for Supabase

## Database Provider Abstraction

The infrastructure is designed to be database-agnostic:
1. All database access through EF Core abstractions
2. Provider-specific code only in `Program.cs` (`UseNpgsql`)
3. To switch databases: change NuGet package, update `Program.cs`, update connection string

## Build and Run

```bash
# Build entire solution
dotnet build

# Run API project
dotnet run --project src/CarBuddy.API

# Watch mode (auto-restart on changes)
dotnet watch --project src/CarBuddy.API
```

## Project Dependencies

### Domain
- None (by design)

### Application
- CarBuddy.Domain
- BCrypt.Net-Next (password hashing)

### Infrastructure
- CarBuddy.Application, CarBuddy.Domain
- Microsoft.EntityFrameworkCore
- Npgsql.EntityFrameworkCore.PostgreSQL
- Microsoft.EntityFrameworkCore.Design
- Microsoft.AspNetCore.Authentication.JwtBearer

### API
- CarBuddy.Infrastructure, CarBuddy.Application
- Swashbuckle.AspNetCore (Swagger)

## Code Organization

- Keep controllers thin (2-10 lines per action)
- Business logic in services, not controllers
- Validation in DTOs and service layer
- Entity configuration in DbContext, not attributes
- Constants and enums in Domain layer
- DTOs are anemic (no behavior)

## Future Considerations

When extending the system:
- Add pagination interfaces for list operations
- Implement caching strategy at service layer
- Consider CQRS for complex operations
- Add domain events for cross-cutting concerns
- Implement soft delete pattern if needed
- Add audit fields (CreatedBy, UpdatedBy) when user tracking required
