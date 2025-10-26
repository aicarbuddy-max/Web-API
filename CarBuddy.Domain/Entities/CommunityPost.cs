using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Domain.Entities;

public class CommunityPost
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    public int LikesCount { get; set; }

    public int CommentsCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
    public ICollection<PostComment> Comments { get; set; } = new List<PostComment>();
}
