using CarBuddy.Application.DTOs.Garage;
using CarBuddy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarBuddy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GaragesController : ControllerBase
{
    private readonly IGarageService _garageService;
    private readonly ILogger<GaragesController> _logger;

    public GaragesController(IGarageService garageService, ILogger<GaragesController> logger)
    {
        _garageService = garageService;
        _logger = logger;
    }

    /// <summary>
    /// Get all garages
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<GarageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<GarageDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching all garages");
        var garages = await _garageService.GetAllGaragesAsync(cancellationToken);
        return Ok(garages);
    }

    /// <summary>
    /// Get garage by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(GarageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GarageDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching garage with ID: {GarageId}", id);
        var garage = await _garageService.GetGarageByIdAsync(id, cancellationToken);

        if (garage == null)
        {
            return NotFound(new { message = $"Garage with ID {id} not found" });
        }

        return Ok(garage);
    }

    /// <summary>
    /// Create a new garage
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(GarageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<GarageDto>> Create([FromBody] CreateGarageDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating new garage: {GarageName}", dto.Name);
        var garage = await _garageService.CreateGarageAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = garage.Id }, garage);
    }

    /// <summary>
    /// Update an existing garage
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(GarageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GarageDto>> Update(Guid id, [FromBody] UpdateGarageDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating garage with ID: {GarageId}", id);
        var garage = await _garageService.UpdateGarageAsync(id, dto, cancellationToken);

        if (garage == null)
        {
            return NotFound(new { message = $"Garage with ID {id} not found" });
        }

        return Ok(garage);
    }

    /// <summary>
    /// Delete a garage
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting garage with ID: {GarageId}", id);
        var deleted = await _garageService.DeleteGarageAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(new { message = $"Garage with ID {id} not found" });
        }

        return NoContent();
    }
}
