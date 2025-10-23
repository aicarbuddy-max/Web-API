using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public class UserAddress
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Label { get; set; } = string.Empty; // e.g., "Home", "Work"

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public bool IsDefault { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
