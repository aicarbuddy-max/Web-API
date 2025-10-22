using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Application.DTOs.Service;

public class UpdateServiceDto
{
    [StringLength(200)]
    public string? Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? Price { get; set; }
}
