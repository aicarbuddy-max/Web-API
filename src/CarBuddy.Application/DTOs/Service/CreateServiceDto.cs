using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Application.DTOs.Service;

public class CreateServiceDto
{
    [Required]
    public Guid GarageId { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
}
