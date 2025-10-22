namespace CarBuddy.Application.DTOs.Service;

public class ServiceDto
{
    public Guid Id { get; set; }
    public Guid GarageId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
}
