using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public class PostLike
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid PostId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public CommunityPost Post { get; set; } = null!;
    public User User { get; set; } = null!;
}
