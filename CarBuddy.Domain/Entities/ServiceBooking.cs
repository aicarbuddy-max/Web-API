using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public enum BookingStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled
}

public class ServiceBooking
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    public Guid GarageId { get; set; }

    public DateTime BookingDate { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public Garage Garage { get; set; } = null!;
}
