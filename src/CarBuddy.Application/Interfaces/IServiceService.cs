using CarBuddy.Application.DTOs.Service;

namespace CarBuddy.Application.Interfaces;

public interface IServiceService
{
    Task<IEnumerable<ServiceDto>> GetAllServicesAsync(CancellationToken cancellationToken = default);
    Task<ServiceDto?> GetServiceByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ServiceDto>> GetServicesByGarageIdAsync(Guid garageId, CancellationToken cancellationToken = default);
    Task<ServiceDto> CreateServiceAsync(CreateServiceDto dto, CancellationToken cancellationToken = default);
    Task<ServiceDto?> UpdateServiceAsync(Guid id, UpdateServiceDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteServiceAsync(Guid id, CancellationToken cancellationToken = default);
}
