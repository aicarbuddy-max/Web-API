using CarBuddy.Application.DTOs.Garage;

namespace CarBuddy.Application.Interfaces;

public interface IGarageService
{
    Task<IEnumerable<GarageDto>> GetAllGaragesAsync(CancellationToken cancellationToken = default);
    Task<GarageDto?> GetGarageByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<GarageDto> CreateGarageAsync(CreateGarageDto dto, CancellationToken cancellationToken = default);
    Task<GarageDto?> UpdateGarageAsync(Guid id, UpdateGarageDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteGarageAsync(Guid id, CancellationToken cancellationToken = default);

    // Business Logic Methods
    Task<IEnumerable<GarageWithDistanceDto>> SearchNearbyGaragesAsync(GarageSearchDto searchDto, CancellationToken cancellationToken = default);
    Task<IEnumerable<GarageDto>> GetTopRatedGaragesAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<Dictionary<string, object>> GetGarageStatisticsAsync(Guid garageId, CancellationToken cancellationToken = default);
}
