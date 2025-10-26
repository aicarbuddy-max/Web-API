using CarBuddy.Domain.Common;

namespace CarBuddy.Domain.Entities;

public class Garage : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public decimal Rating { get; set; }

    // Navigation property
    public ICollection<Service> Services { get; set; } = new List<Service>();
}
