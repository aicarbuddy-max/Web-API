using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public class Review
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public Guid? GarageId { get; set; }

    public Guid? AutoPartsShopId { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Garage? Garage { get; set; }
    public AutoPartsShop? AutoPartsShop { get; set; }
}
