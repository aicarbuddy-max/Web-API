using CarBuddy.Application.DTOs.Service;
using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;

namespace CarBuddy.Application.Services;

public class ServiceService : IServiceService
{
    private readonly IUnitOfWork _unitOfWork;

    public ServiceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync(CancellationToken cancellationToken = default)
    {
        var services = await _unitOfWork.Services.GetAllAsync(cancellationToken);
        return services.Select(MapToDto);
    }

    public async Task<ServiceDto?> GetServiceByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await _unitOfWork.Services.GetByIdAsync(id, cancellationToken);
        return service == null ? null : MapToDto(service);
    }

    public async Task<IEnumerable<ServiceDto>> GetServicesByGarageIdAsync(Guid garageId, CancellationToken cancellationToken = default)
    {
        var services = await _unitOfWork.Services.FindAsync(s => s.GarageId == garageId, cancellationToken);
        return services.Select(MapToDto);
    }

    public async Task<ServiceDto> CreateServiceAsync(CreateServiceDto dto, CancellationToken cancellationToken = default)
    {
        // Verify garage exists
        var garage = await _unitOfWork.Garages.GetByIdAsync(dto.GarageId, cancellationToken);
        if (garage == null)
        {
            throw new InvalidOperationException($"Garage with ID {dto.GarageId} not found");
        }

        var service = new Service
        {
            GarageId = dto.GarageId,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price
        };

        await _unitOfWork.Services.AddAsync(service, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(service);
    }

    public async Task<ServiceDto?> UpdateServiceAsync(Guid id, UpdateServiceDto dto, CancellationToken cancellationToken = default)
    {
        var service = await _unitOfWork.Services.GetByIdAsync(id, cancellationToken);
        if (service == null) return null;

        if (dto.Name != null) service.Name = dto.Name;
        if (dto.Description != null) service.Description = dto.Description;
        if (dto.Price.HasValue) service.Price = dto.Price.Value;

        await _unitOfWork.Services.UpdateAsync(service, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(service);
    }

    public async Task<bool> DeleteServiceAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await _unitOfWork.Services.GetByIdAsync(id, cancellationToken);
        if (service == null) return false;

        await _unitOfWork.Services.DeleteAsync(service, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static ServiceDto MapToDto(Service service) => new()
    {
        Id = service.Id,
        GarageId = service.GarageId,
        Name = service.Name,
        Description = service.Description,
        Price = service.Price,
        CreatedAt = service.CreatedAt
    };
}
