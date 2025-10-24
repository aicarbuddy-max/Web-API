using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Application.DTOs.AutoPartsShop;

public class CreateAutoPartsShopDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Address { get; set; } = string.Empty;

    [Range(-90, 90)]
    public double Latitude { get; set; }

    [Range(-180, 180)]
    public double Longitude { get; set; }

    [Range(0, 5)]
    public decimal Rating { get; set; }
}
