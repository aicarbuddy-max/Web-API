using CarBuddy.Application.DTOs.Auth;
using CarBuddy.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarBuddy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IAuthService authService, ILogger<UsersController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Registering new user: {Username}", request.Username);
        var response = await _authService.RegisterAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Register), new { username = request.Username }, response);
    }

    /// <summary>
    /// Login with existing credentials
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("User login attempt: {Email}", request.Email);
        var response = await _authService.LoginAsync(request, cancellationToken);
        return Ok(response);
    }
}
