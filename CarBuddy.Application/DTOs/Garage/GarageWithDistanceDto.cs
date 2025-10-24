namespace CarBuddy.Application.DTOs.Garage;

public class GarageWithDistanceDto : GarageDto
{
    public double DistanceKm { get; set; }
    public int ServiceCount { get; set; }
}
