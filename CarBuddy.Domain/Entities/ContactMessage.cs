using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public class ContactMessage
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public bool IsResolved { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
