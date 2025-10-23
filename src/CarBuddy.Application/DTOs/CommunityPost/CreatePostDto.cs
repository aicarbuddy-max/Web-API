using System.ComponentModel.DataAnnotations;

namespace CarBuddy.Application.DTOs.CommunityPost;

public class CreatePostDto
{
    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}
