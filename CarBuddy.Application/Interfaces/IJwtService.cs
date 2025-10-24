using CarBuddy.Domain.Entities;

namespace CarBuddy.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
