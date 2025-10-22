using CarBuddy.Application.DTOs.Garage;
using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;

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
