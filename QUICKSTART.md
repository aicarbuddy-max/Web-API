# Quick Start Guide

Get the CarBuddy API running in 5 minutes!

## Prerequisites

- .NET 8 SDK installed
- PostgreSQL database (local or Supabase account)

## Step 1: Configure Database

Choose one option:

### Option A: Local PostgreSQL

Edit `src/CarBuddy.API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=carbuddy_dev;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

### Option B: Supabase (Free)

1. Create a free account at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy your connection string
5. Edit `src/CarBuddy.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_SUPABASE_PASSWORD;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

## Step 2: Install EF Tools

```bash
dotnet tool install --global dotnet-ef
```

## Step 3: Create Database

```bash
cd src/CarBuddy.API
dotnet ef migrations add InitialCreate --project ../CarBuddy.Infrastructure --startup-project .
dotnet ef database update --project ../CarBuddy.Infrastructure --startup-project .
```

## Step 4: Run the Application

```bash
dotnet run
```

Open your browser to: **https://localhost:7001**

## Step 5: Test It Out

### 1. Register a User

In Swagger UI:
1. Expand `POST /api/users/register`
2. Click "Try it out"
3. Use this request body:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!"
}
```
4. Click "Execute"
5. Copy the `token` from the response

### 2. Authorize in Swagger

1. Click the "Authorize" button (top right)
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"

### 3. Create a Garage

1. Expand `POST /api/garages`
2. Click "Try it out"
3. Use this request body:
```json
{
  "name": "Mike's Auto Repair",
  "address": "123 Main Street",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "rating": 4.5
}
```
4. Click "Execute"

### 4. Get All Garages

1. Expand `GET /api/garages`
2. Click "Try it out"
3. Click "Execute"

You should see your created garage!

## Common Issues

### "Connection refused" error
- Make sure PostgreSQL is running
- Check your connection string credentials
- Verify the database host and port

### "JWT Secret Key is not configured" error
- The default key in appsettings.json should work
- If you changed it, make sure it's at least 32 characters

### "No such table" error
- Run the database migration commands again
- Check that migrations were created in `Infrastructure/Migrations`

### Port already in use
Change the port in `src/CarBuddy.API/Properties/launchSettings.json`

## What's Next?

- Check out `README.md` for full documentation
- See `CLAUDE.md` for architecture details
- Add more entities and endpoints
- Implement role-based authorization
- Add unit tests

## API Endpoints Summary

### Public (No Auth Required)
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login

### Protected (JWT Required)
- `GET /api/garages` - List all garages
- `POST /api/garages` - Create garage
- `GET /api/services` - List all services
- `POST /api/services` - Create service
- `GET /api/autopartsshops` - List all auto parts shops
- `POST /api/autopartsshops` - Create auto parts shop

Plus UPDATE and DELETE operations for each resource.

## Support

For detailed documentation, see `README.md`
For architecture guidance, see `CLAUDE.md`
