using CarBuddy.Application.DTOs.Service;
using CarBuddy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarBuddy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;
    private readonly ILogger<ServicesController> _logger;

    public ServicesController(IServiceService serviceService, ILogger<ServicesController> logger)
    {
        _serviceService = serviceService;
        _logger = logger;
    }

    /// <summary>
    /// Get all services
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ServiceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching all services");
        var services = await _serviceService.GetAllServicesAsync(cancellationToken);
        return Ok(services);
    }

    /// <summary>
    /// Get service by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ServiceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ServiceDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching service with ID: {ServiceId}", id);
        var service = await _serviceService.GetServiceByIdAsync(id, cancellationToken);

        if (service == null)
        {
            return NotFound(new { message = $"Service with ID {id} not found" });
        }

        return Ok(service);
    }

    /// <summary>
    /// Get services by garage ID
    /// </summary>
    [HttpGet("garage/{garageId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ServiceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetByGarageId(Guid garageId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching services for garage ID: {GarageId}", garageId);
        var services = await _serviceService.GetServicesByGarageIdAsync(garageId, cancellationToken);
        return Ok(services);
    }

    /// <summary>
    /// Create a new service
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ServiceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ServiceDto>> Create([FromBody] CreateServiceDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating new service: {ServiceName}", dto.Name);
        var service = await _serviceService.CreateServiceAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }

    /// <summary>
    /// Update an existing service
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ServiceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ServiceDto>> Update(Guid id, [FromBody] UpdateServiceDto dto, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating service with ID: {ServiceId}", id);
        var service = await _serviceService.UpdateServiceAsync(id, dto, cancellationToken);

        if (service == null)
        {
            return NotFound(new { message = $"Service with ID {id} not found" });
        }

        return Ok(service);
    }

    /// <summary>
    /// Delete a service
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting service with ID: {ServiceId}", id);
        var deleted = await _serviceService.DeleteServiceAsync(id, cancellationToken);

        if (!deleted)
        {
            return NotFound(new { message = $"Service with ID {id} not found" });
        }

        return NoContent();
    }
}
