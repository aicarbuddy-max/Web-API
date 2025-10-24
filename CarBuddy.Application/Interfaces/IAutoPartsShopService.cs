using CarBuddy.Application.DTOs.AutoPartsShop;

namespace CarBuddy.Application.Interfaces;

public interface IAutoPartsShopService
{
    Task<IEnumerable<AutoPartsShopDto>> GetAllAutoPartsShopsAsync(CancellationToken cancellationToken = default);
    Task<AutoPartsShopDto?> GetAutoPartsShopByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<AutoPartsShopDto> CreateAutoPartsShopAsync(CreateAutoPartsShopDto dto, CancellationToken cancellationToken = default);
    Task<AutoPartsShopDto?> UpdateAutoPartsShopAsync(Guid id, UpdateAutoPartsShopDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAutoPartsShopAsync(Guid id, CancellationToken cancellationToken = default);
}
