# Business Logic Implementation Guide

This guide shows you how to add complex business logic in Clean Architecture using LINQ (similar to stored procedures).

## 📍 Where to Add Business Logic

**Application Layer → Services** (`src/CarBuddy.Application/Services/`)

```
✅ Application/Services/GarageService.cs  - Business logic here
❌ Infrastructure/Repositories/          - Only data access, no logic
❌ API/Controllers/                      - Only routing, no logic
❌ Domain/Entities/                      - Only properties, no logic
```

## 🎯 Pattern to Follow

### Step 1: Create DTOs (if needed)
```csharp
// src/CarBuddy.Application/DTOs/Garage/GarageSearchDto.cs
public class GarageSearchDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double RadiusKm { get; set; } = 10;
    public decimal? MinRating { get; set; }
}
```

### Step 2: Add Method to Interface
```csharp
// src/CarBuddy.Application/Interfaces/IGarageService.cs
public interface IGarageService
{
    // Existing methods...

    // New business logic method
    Task<IEnumerable<GarageWithDistanceDto>> SearchNearbyGaragesAsync(
        GarageSearchDto searchDto,
        CancellationToken cancellationToken = default);
}
```

### Step 3: Implement Business Logic with LINQ
```csharp
// src/CarBuddy.Application/Services/GarageService.cs
public async Task<IEnumerable<GarageWithDistanceDto>> SearchNearbyGaragesAsync(
    GarageSearchDto searchDto,
    CancellationToken cancellationToken = default)
{
    // 1. Get data from repository
    var allGarages = await _unitOfWork.Garages.GetAllAsync(cancellationToken);

    // 2. Apply business logic with LINQ
    var nearbyGarages = allGarages
        .Select(garage => new
        {
            Garage = garage,
            Distance = CalculateDistance(
                searchDto.Latitude,
                searchDto.Longitude,
                garage.Latitude,
                garage.Longitude)
        })
        .Where(x => x.Distance <= searchDto.RadiusKm)  // Filter
        .OrderBy(x => x.Distance)                       // Sort
        .Select(x => MapToDto(x.Garage));              // Transform

    return nearbyGarages.ToList();
}
```

### Step 4: Add Controller Endpoint
```csharp
// src/CarBuddy.API/Controllers/GaragesController.cs
[HttpPost("search")]
public async Task<ActionResult<IEnumerable<GarageWithDistanceDto>>> SearchNearby(
    [FromBody] GarageSearchDto searchDto,
    CancellationToken cancellationToken)
{
    var garages = await _garageService.SearchNearbyGaragesAsync(searchDto, cancellationToken);
    return Ok(garages);
}
```

## 📚 LINQ Examples (Replaces Stored Procedures)

### Example 1: Filtering & Sorting
```csharp
var topGarages = await _unitOfWork.Garages.GetAllAsync(cancellationToken);

var filtered = topGarages
    .Where(g => g.Rating >= 4.0m)              // WHERE clause
    .OrderByDescending(g => g.Rating)          // ORDER BY
    .ThenBy(g => g.Name)                       // THEN BY
    .Take(10)                                   // TOP 10
    .ToList();
```

### Example 2: Aggregations
```csharp
var services = await _unitOfWork.Services.FindAsync(s => s.GarageId == garageId, cancellationToken);

var stats = new
{
    TotalServices = services.Count(),                    // COUNT(*)
    AveragePrice = services.Average(s => s.Price),      // AVG(Price)
    MinPrice = services.Min(s => s.Price),              // MIN(Price)
    MaxPrice = services.Max(s => s.Price),              // MAX(Price)
    TotalRevenue = services.Sum(s => s.Price)           // SUM(Price)
};
```

### Example 3: Grouping
```csharp
var servicesByCategory = services
    .GroupBy(s => s.Name.Split(' ').First())    // GROUP BY
    .Select(g => new
    {
        Category = g.Key,
        Count = g.Count(),
        AvgPrice = g.Average(s => s.Price)
    })
    .OrderByDescending(x => x.Count)
    .ToList();
```

### Example 4: Joins
```csharp
var garagesWithServiceCount = from garage in await _unitOfWork.Garages.GetAllAsync()
                              join service in await _unitOfWork.Services.GetAllAsync()
                              on garage.Id equals service.GarageId into services
                              select new
                              {
                                  Garage = garage,
                                  ServiceCount = services.Count()
                              };
```

### Example 5: Complex Calculations
```csharp
// Distance calculation (Haversine formula)
var nearbyLocations = locations
    .Select(loc => new
    {
        Location = loc,
        Distance = CalculateDistance(userLat, userLon, loc.Latitude, loc.Longitude)
    })
    .Where(x => x.Distance <= radiusKm)
    .OrderBy(x => x.Distance);

private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
{
    const double earthRadiusKm = 6371;
    var dLat = DegreesToRadians(lat2 - lat1);
    var dLon = DegreesToRadians(lon2 - lon1);

    var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
            Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
            Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

    var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    return earthRadiusKm * c;
}
```

## 🔥 Real-World Examples Implemented

### 1. Search Nearby Garages
**Endpoint:** `POST /api/garages/search`

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radiusKm": 10,
  "minRating": 4.0
}
```

**Response:**
```json
[
  {
    "id": "...",
    "name": "Mike's Auto Repair",
    "distanceKm": 2.5,
    "serviceCount": 15,
    "rating": 4.5
  }
]
```

### 2. Get Top-Rated Garages
**Endpoint:** `GET /api/garages/top-rated?count=5`

**Logic:**
- Sorts by rating (highest first)
- Then by creation date
- Returns top N results

### 3. Garage Statistics (Like Stored Procedure)
**Endpoint:** `GET /api/garages/{id}/statistics`

**Response:**
```json
{
  "garageId": "...",
  "garageName": "Mike's Auto Repair",
  "rating": 4.5,
  "totalServices": 15,
  "averageServicePrice": 75.50,
  "minServicePrice": 25.00,
  "maxServicePrice": 250.00,
  "totalRevenuePotential": 1132.50,
  "mostExpensiveService": "Engine Overhaul",
  "serviceCategories": [
    { "category": "Oil", "count": 5 },
    { "category": "Brake", "count": 3 }
  ],
  "daysSinceCreation": 45
}
```

## 🎓 Common LINQ Operations

| SQL Operation | LINQ Equivalent |
|--------------|----------------|
| `SELECT * FROM` | `.ToList()` or `.GetAllAsync()` |
| `WHERE condition` | `.Where(x => condition)` |
| `ORDER BY column` | `.OrderBy(x => x.Property)` |
| `ORDER BY DESC` | `.OrderByDescending(x => x.Property)` |
| `TOP N` | `.Take(N)` |
| `COUNT(*)` | `.Count()` |
| `SUM(column)` | `.Sum(x => x.Property)` |
| `AVG(column)` | `.Average(x => x.Property)` |
| `MIN(column)` | `.Min(x => x.Property)` |
| `MAX(column)` | `.Max(x => x.Property)` |
| `GROUP BY` | `.GroupBy(x => x.Property)` |
| `HAVING` | `.Where()` after `.GroupBy()` |
| `DISTINCT` | `.Distinct()` |
| `JOIN` | `join ... on ... equals ...` |

## ✅ Best Practices

1. **Keep Logic in Services** - Never in controllers or repositories
2. **Use LINQ for Queries** - Don't write raw SQL unless absolutely necessary
3. **Return DTOs** - Never expose entities directly to API
4. **Use Async/Await** - Always for database operations
5. **Add Validation** - Check inputs before processing
6. **Handle Errors** - Throw meaningful exceptions
7. **Log Operations** - Use ILogger for debugging
8. **Unit Test** - Test business logic independently

## 🚀 How to Test

### Using Swagger (http://localhost:5050)

1. **Register & Login** to get JWT token
2. **Authorize** with the token
3. **Try the new endpoints:**
   - `POST /api/garages/search` - Search nearby
   - `GET /api/garages/top-rated` - Get top rated
   - `GET /api/garages/{id}/statistics` - Get stats

### Using cURL

```bash
# Search nearby garages
curl -X POST http://localhost:5050/api/garages/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusKm": 10,
    "minRating": 4.0
  }'
```

## 📝 Adding Your Own Business Logic

1. **Identify the requirement** - What business rule do you need?
2. **Create DTOs** - Input/Output models
3. **Add to interface** - `I{Entity}Service`
4. **Implement with LINQ** - In service class
5. **Add controller endpoint** - Expose via API
6. **Test** - Use Swagger or cURL

## 💡 Tips

- **Complex calculations?** Create helper methods (private static)
- **Reusable logic?** Create extension methods
- **Database-specific?** Consider using raw SQL via `FromSqlRaw()`
- **Performance issue?** Add database indexes or use pagination
- **Multiple tables?** Use joins or multiple queries with LINQ

## 🎯 Summary

**Clean Architecture Flow:**
```
Controller → Service (Business Logic with LINQ) → Repository (Data Access) → Database
```

All your business logic lives in **Services** using **LINQ** - it's powerful, type-safe, and maintainable!
