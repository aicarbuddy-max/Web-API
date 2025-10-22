using CarBuddy.Domain.Common;

namespace CarBuddy.Domain.Entities;

public class Service : BaseEntity
{
    public Guid GarageId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }

    // Navigation property
    public Garage Garage { get; set; } = null!;
}
