using CarBuddy.Application.DTOs.CommunityPost;

namespace CarBuddy.Application.Interfaces;

public interface ICommunityPostService
{
    Task<IEnumerable<CommunityPostDto>> GetAllPostsAsync(Guid? currentUserId, CancellationToken cancellationToken = default);
    Task<CommunityPostDto?> GetPostByIdAsync(Guid id, Guid? currentUserId, CancellationToken cancellationToken = default);
    Task<CommunityPostDto> CreatePostAsync(Guid userId, CreatePostDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeletePostAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<bool> LikePostAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default);
    Task<bool> UnlikePostAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<PostCommentDto>> GetPostCommentsAsync(Guid postId, CancellationToken cancellationToken = default);
    Task<PostCommentDto> AddCommentAsync(Guid postId, Guid userId, CreateCommentDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);
}
