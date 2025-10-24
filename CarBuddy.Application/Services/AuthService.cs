using CarBuddy.Application.DTOs.Auth;
using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;
using CarBuddy.Domain.Enums;

namespace CarBuddy.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        var existingUsers = await _unitOfWork.Users.FindAsync(
            u => u.Email == request.Email || u.Username == request.Username,
            cancellationToken);

        if (existingUsers.Any())
        {
            throw new InvalidOperationException("User with this email or username already exists");
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create user
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = UserRole.User
        };

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Generate token
        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        // Find user by email
        var users = await _unitOfWork.Users.FindAsync(
            u => u.Email == request.Email,
            cancellationToken);

        var user = users.FirstOrDefault();

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Generate token
        var token = _jwtService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
}
