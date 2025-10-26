using CarBuddy.Application.DTOs.Garage;
using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarBuddy.Application.Services;

public class GarageService : IGarageService
{
    private readonly IUnitOfWork _unitOfWork;

    public GarageService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<GarageDto>> GetAllGaragesAsync(CancellationToken cancellationToken = default)
    {
        var garages = await _unitOfWork.Garages.GetAllAsync(cancellationToken);
        return garages.Select(MapToDto);
    }

    public async Task<GarageDto?> GetGarageByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var garage = await _unitOfWork.Garages.GetByIdAsync(id, cancellationToken);
        return garage == null ? null : MapToDto(garage);
    }

    public async Task<GarageDto> CreateGarageAsync(CreateGarageDto dto, CancellationToken cancellationToken = default)
    {
        var garage = new Garage
        {
            Name = dto.Name,
            Address = dto.Address,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Rating = dto.Rating
        };

        await _unitOfWork.Garages.AddAsync(garage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(garage);
    }

    public async Task<GarageDto?> UpdateGarageAsync(Guid id, UpdateGarageDto dto, CancellationToken cancellationToken = default)
    {
        var garage = await _unitOfWork.Garages.GetByIdAsync(id, cancellationToken);
        if (garage == null) return null;

        if (dto.Name != null) garage.Name = dto.Name;
        if (dto.Address != null) garage.Address = dto.Address;
        if (dto.Latitude.HasValue) garage.Latitude = dto.Latitude.Value;
        if (dto.Longitude.HasValue) garage.Longitude = dto.Longitude.Value;
        if (dto.Rating.HasValue) garage.Rating = dto.Rating.Value;

        garage.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Garages.UpdateAsync(garage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(garage);
    }

    public async Task<bool> DeleteGarageAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var garage = await _unitOfWork.Garages.GetByIdAsync(id, cancellationToken);
        if (garage == null) return false;

        await _unitOfWork.Garages.DeleteAsync(garage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    // BUSINESS LOGIC: Search garages near a location with distance calculation
    public async Task<IEnumerable<GarageWithDistanceDto>> SearchNearbyGaragesAsync(
        GarageSearchDto searchDto,
        CancellationToken cancellationToken = default)
    {
        // ✅ Use IQueryable for database-side filtering (rating filter executes in DB)
        var garageQuery = _unitOfWork.Garages.Query();
        var serviceQuery = _unitOfWork.Services.Query();

        // Apply rating filter at database level
        if (searchDto.MinRating.HasValue)
        {
            garageQuery = garageQuery.Where(g => g.Rating >= searchDto.MinRating.Value);
        }

        // Execute query and get filtered garages from database
        var garages = await garageQuery.ToListAsync(cancellationToken);

        // Get service counts in a single query (database-side GROUP BY)
        var serviceCounts = await serviceQuery
            .GroupBy(s => s.GarageId)
            .Select(g => new { GarageId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.GarageId, x => x.Count, cancellationToken);

        // ⚠️ Distance calculation must happen in memory (Haversine formula cannot be translated to SQL)
        var nearbyGarages = garages
            .Select(garage => new
            {
                Garage = garage,
                Distance = CalculateDistance(
                    searchDto.Latitude,
                    searchDto.Longitude,
                    garage.Latitude,
                    garage.Longitude),
                ServiceCount = serviceCounts.ContainsKey(garage.Id) ? serviceCounts[garage.Id] : 0
            })
            .Where(x => x.Distance <= searchDto.RadiusKm) // Filter by radius (in memory)
            .OrderBy(x => x.Distance) // Sort by nearest first
            .Select(x => new GarageWithDistanceDto
            {
                Id = x.Garage.Id,
                Name = x.Garage.Name,
                Address = x.Garage.Address,
                Latitude = x.Garage.Latitude,
                Longitude = x.Garage.Longitude,
                Rating = x.Garage.Rating,
                CreatedAt = x.Garage.CreatedAt,
                UpdatedAt = x.Garage.UpdatedAt,
                DistanceKm = Math.Round(x.Distance, 2),
                ServiceCount = x.ServiceCount
            });

        return nearbyGarages.ToList();
    }

    // BUSINESS LOGIC: Get top-rated garages
    public async Task<IEnumerable<GarageDto>> GetTopRatedGaragesAsync(
        int count = 10,
        CancellationToken cancellationToken = default)
    {
        // ✅ Use IQueryable for database-side sorting and filtering
        var topRated = await _unitOfWork.Garages.Query()
            .OrderByDescending(g => g.Rating)        // Executes in database: ORDER BY Rating DESC
            .ThenByDescending(g => g.CreatedAt)      // Executes in database: THEN BY CreatedAt DESC
            .Take(count)                             // Executes in database: LIMIT {count}
            .Select(g => MapToDto(g))                // Map to DTO
            .ToListAsync(cancellationToken);         // Execute query

        return topRated;
    }

    // BUSINESS LOGIC: Get garage statistics (like a stored procedure with complex aggregations)
    public async Task<Dictionary<string, object>> GetGarageStatisticsAsync(
        Guid garageId,
        CancellationToken cancellationToken = default)
    {
        var garage = await _unitOfWork.Garages.GetByIdAsync(garageId, cancellationToken);
        if (garage == null)
        {
            throw new KeyNotFoundException($"Garage with ID {garageId} not found");
        }

        // ✅ Use IQueryable for database-side aggregations
        var serviceQuery = _unitOfWork.Services.Query()
            .Where(s => s.GarageId == garageId);  // Filter at database level

        // Execute aggregations at database level
        var totalServices = await serviceQuery.CountAsync(cancellationToken);
        var averagePrice = totalServices > 0
            ? Math.Round(await serviceQuery.AverageAsync(s => s.Price, cancellationToken), 2)
            : 0;
        var minPrice = totalServices > 0
            ? await serviceQuery.MinAsync(s => s.Price, cancellationToken)
            : 0;
        var maxPrice = totalServices > 0
            ? await serviceQuery.MaxAsync(s => s.Price, cancellationToken)
            : 0;
        var totalRevenue = await serviceQuery.SumAsync(s => s.Price, cancellationToken);
        var mostExpensiveService = totalServices > 0
            ? await serviceQuery.OrderByDescending(s => s.Price).Select(s => s.Name).FirstOrDefaultAsync(cancellationToken)
            : "N/A";

        // Get service names from database, then group in memory (Split can't be translated to SQL)
        var serviceNames = await serviceQuery.Select(s => s.Name).ToListAsync(cancellationToken);
        var serviceCategories = serviceNames
            .GroupBy(name => name.Split(' ').First())  // GROUP BY first word (in memory)
            .Select(g => new { Category = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();

        // Build statistics dictionary
        var statistics = new Dictionary<string, object>
        {
            ["GarageId"] = garage.Id,
            ["GarageName"] = garage.Name,
            ["Rating"] = garage.Rating,
            ["TotalServices"] = totalServices,
            ["AverageServicePrice"] = averagePrice,
            ["MinServicePrice"] = minPrice,
            ["MaxServicePrice"] = maxPrice,
            ["TotalRevenuePotential"] = totalRevenue,
            ["MostExpensiveService"] = mostExpensiveService ?? "N/A",
            ["ServiceCategories"] = serviceCategories,
            ["CreatedAt"] = garage.CreatedAt,
            ["DaysSinceCreation"] = (DateTime.UtcNow - garage.CreatedAt).Days
        };

        return statistics;
    }

    // Helper method: Haversine formula to calculate distance between two coordinates
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

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }

    private static GarageDto MapToDto(Garage garage) => new()
    {
        Id = garage.Id,
        Name = garage.Name,
        Address = garage.Address,
        Latitude = garage.Latitude,
        Longitude = garage.Longitude,
        Rating = garage.Rating,
        CreatedAt = garage.CreatedAt,
        UpdatedAt = garage.UpdatedAt
    };
}
