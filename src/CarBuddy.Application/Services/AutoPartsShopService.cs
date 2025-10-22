using CarBuddy.Application.DTOs.AutoPartsShop;
using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;

namespace CarBuddy.Application.Services;

public class AutoPartsShopService : IAutoPartsShopService
{
    private readonly IUnitOfWork _unitOfWork;

    public AutoPartsShopService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AutoPartsShopDto>> GetAllAutoPartsShopsAsync(CancellationToken cancellationToken = default)
    {
        var shops = await _unitOfWork.AutoPartsShops.GetAllAsync(cancellationToken);
        return shops.Select(MapToDto);
    }

    public async Task<AutoPartsShopDto?> GetAutoPartsShopByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var shop = await _unitOfWork.AutoPartsShops.GetByIdAsync(id, cancellationToken);
        return shop == null ? null : MapToDto(shop);
    }

    public async Task<AutoPartsShopDto> CreateAutoPartsShopAsync(CreateAutoPartsShopDto dto, CancellationToken cancellationToken = default)
    {
        var shop = new AutoPartsShop
        {
            Name = dto.Name,
            Address = dto.Address,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            Rating = dto.Rating
        };

        await _unitOfWork.AutoPartsShops.AddAsync(shop, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(shop);
    }

    public async Task<AutoPartsShopDto?> UpdateAutoPartsShopAsync(Guid id, UpdateAutoPartsShopDto dto, CancellationToken cancellationToken = default)
    {
        var shop = await _unitOfWork.AutoPartsShops.GetByIdAsync(id, cancellationToken);
        if (shop == null) return null;

        if (dto.Name != null) shop.Name = dto.Name;
        if (dto.Address != null) shop.Address = dto.Address;
        if (dto.Latitude.HasValue) shop.Latitude = dto.Latitude.Value;
        if (dto.Longitude.HasValue) shop.Longitude = dto.Longitude.Value;
        if (dto.Rating.HasValue) shop.Rating = dto.Rating.Value;

        shop.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.AutoPartsShops.UpdateAsync(shop, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(shop);
    }

    public async Task<bool> DeleteAutoPartsShopAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var shop = await _unitOfWork.AutoPartsShops.GetByIdAsync(id, cancellationToken);
        if (shop == null) return false;

        await _unitOfWork.AutoPartsShops.DeleteAsync(shop, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static AutoPartsShopDto MapToDto(AutoPartsShop shop) => new()
    {
        Id = shop.Id,
        Name = shop.Name,
        Address = shop.Address,
        Latitude = shop.Latitude,
        Longitude = shop.Longitude,
        Rating = shop.Rating,
        CreatedAt = shop.CreatedAt,
        UpdatedAt = shop.UpdatedAt
    };
}
