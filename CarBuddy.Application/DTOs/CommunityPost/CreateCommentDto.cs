using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Application.DTOs.CommunityPost;

public class CreateCommentDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;
}
