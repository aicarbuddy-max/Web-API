namespace CarBuddy.Application.DTOs.Garage;

public class GarageSearchDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double RadiusKm { get; set; } = 10; // Default 10km radius
    public decimal? MinRating { get; set; }
}
