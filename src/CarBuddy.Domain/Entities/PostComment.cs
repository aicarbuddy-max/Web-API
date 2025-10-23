using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public class PostComment
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid PostId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public CommunityPost Post { get; set; } = null!;
    public User User { get; set; } = null!;
}
