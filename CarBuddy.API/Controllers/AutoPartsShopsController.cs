using CarBuddy.Application.DTOs.AutoPartsShop;
using CarBuddy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarBuddy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AutoPartsShopsController : ControllerBase
{
    private readonly IAutoPartsShopService _autoPartsShopService;
    private readonly ILogger<AutoPartsShopsController> _logger;

    public AutoPartsShopsController(IAutoPartsShopService autoPartsShopService, ILogger<AutoPartsShopsController> logger)
    {
        _autoPartsShopService = autoPartsShopService;
        _logger = logger;
    }

    /// <summary>
    /// Get all auto parts shops
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AutoPartsShopDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AutoPartsShopDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching all auto parts shops");
        var shops = await _autoPartsShopService.GetAllAutoPartsShopsAsync(cancellationToken);
        return Ok(shops);
    }

    /// <summary>
    /// Get auto parts shop by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(AutoPartsShopDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AutoPartsShopDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching auto parts shop with ID: {ShopId}", id);
        var shop = await _autoPartsShopService.GetAutoPartsShopByIdAsync(id, cancellationToken);

        if (shop == null)
        {
            return NotFound(new { message = $"Auto parts shop with ID {id} not found" });
        }

        return Ok(shop);
    }

    /// <summary>
    /// Create a new auto parts shop
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AutoPartsShopDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AutoPartsShopDto>> Create([FromBody] CreateAutoPartsShopDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating new auto parts shop: {ShopName}", dto.Name);
        var shop = await _autoPartsShopService.CreateAutoPartsShopAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = shop.Id }, shop);
    }

    /// <summary>
    /// Update an existing auto parts shop
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(AutoPartsShopDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AutoPartsShopDto>> Update(Guid id, [FromBody] UpdateAutoPartsShopDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating auto parts shop with ID: {ShopId}", id);
        var shop = await _autoPartsShopService.UpdateAutoPartsShopAsync(id, dto, cancellationToken);

        if (shop == null)
        {
            return NotFound(new { message = $"Auto parts shop with ID {id} not found" });
        }

        return Ok(shop);
    }

    /// <summary>
    /// Delete an auto parts shop
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting auto parts shop with ID: {ShopId}", id);
        var deleted = await _autoPartsShopService.DeleteAutoPartsShopAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(new { message = $"Auto parts shop with ID {id} not found" });
        }

        return NoContent();
    }
}
