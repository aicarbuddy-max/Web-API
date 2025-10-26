using CarBuddy.Application.DTOs.CommunityPost;
using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CarBuddy.Application.Services;

public class CommunityPostService : ICommunityPostService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CommunityPostService> _logger;

    public CommunityPostService(IUnitOfWork unitOfWork, ILogger<CommunityPostService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<IEnumerable<CommunityPostDto>> GetAllPostsAsync(Guid? currentUserId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching all community posts");

        var posts = await _unitOfWork.CommunityPosts.Query()
            .Include(p => p.User)
            .Include(p => p.Likes)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        return posts.Select(p => new CommunityPostDto
        {
            Id = p.Id,
            UserId = p.UserId,
            Username = p.User.FullName,
            Content = p.Content,
            LikesCount = p.LikesCount,
            CommentsCount = p.CommentsCount,
            IsLikedByCurrentUser = currentUserId.HasValue && p.Likes.Any(l => l.UserId == currentUserId.Value),
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        });
    }

    public async Task<CommunityPostDto?> GetPostByIdAsync(Guid id, Guid? currentUserId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching community post: {PostId}", id);

        var post = await _unitOfWork.CommunityPosts.Query()
            .Include(p => p.User)
            .Include(p => p.Likes)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (post == null)
            return null;

        return new CommunityPostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Username = post.User.FullName,
            Content = post.Content,
            LikesCount = post.LikesCount,
            CommentsCount = post.CommentsCount,
            IsLikedByCurrentUser = currentUserId.HasValue && post.Likes.Any(l => l.UserId == currentUserId.Value),
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt
        };
    }

    public async Task<CommunityPostDto> CreatePostAsync(Guid userId, CreatePostDto dto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new community post for user: {UserId}", userId);

        var post = new CommunityPost
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Content = dto.Content,
            LikesCount = 0,
            CommentsCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.CommunityPosts.AddAsync(post, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);

        return new CommunityPostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Username = user?.FullName ?? "Unknown",
            Content = post.Content,
            LikesCount = post.LikesCount,
            CommentsCount = post.CommentsCount,
            IsLikedByCurrentUser = false,
            CreatedAt = post.CreatedAt
        };
    }

    public async Task<bool> DeletePostAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting community post: {PostId} by user: {UserId}", id, userId);

        var post = await _unitOfWork.CommunityPosts.GetByIdAsync(id, cancellationToken);

        if (post == null || post.UserId != userId)
            return false;

        await _unitOfWork.CommunityPosts.DeleteAsync(post, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<bool> LikePostAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("User {UserId} liking post {PostId}", userId, postId);

        var existingLike = await _unitOfWork.PostLikes.Query()
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId, cancellationToken);

        if (existingLike != null)
            return false; // Already liked

        var like = new PostLike
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.PostLikes.AddAsync(like, cancellationToken);

        var post = await _unitOfWork.CommunityPosts.GetByIdAsync(postId, cancellationToken);
        if (post != null)
        {
            post.LikesCount++;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> UnlikePostAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("User {UserId} unliking post {PostId}", userId, postId);

        var like = await _unitOfWork.PostLikes.Query()
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId, cancellationToken);

        if (like == null)
            return false;

        await _unitOfWork.PostLikes.DeleteAsync(like, cancellationToken);

        var post = await _unitOfWork.CommunityPosts.GetByIdAsync(postId, cancellationToken);
        if (post != null && post.LikesCount > 0)
        {
            post.LikesCount--;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<IEnumerable<PostCommentDto>> GetPostCommentsAsync(Guid postId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching comments for post: {PostId}", postId);

        var comments = await _unitOfWork.PostComments.Query()
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        return comments.Select(c => new PostCommentDto
        {
            Id = c.Id,
            PostId = c.PostId,
            UserId = c.UserId,
            Username = c.User.FullName,
            Content = c.Content,
            CreatedAt = c.CreatedAt
        });
    }

    public async Task<PostCommentDto> AddCommentAsync(Guid postId, Guid userId, CreateCommentDto dto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Adding comment to post {PostId} by user {UserId}", postId, userId);

        var comment = new PostComment
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.PostComments.AddAsync(comment, cancellationToken);

        var post = await _unitOfWork.CommunityPosts.GetByIdAsync(postId, cancellationToken);
        if (post != null)
        {
            post.CommentsCount++;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);

        return new PostCommentDto
        {
            Id = comment.Id,
            PostId = comment.PostId,
            UserId = comment.UserId,
            Username = user?.FullName ?? "Unknown",
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        };
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting comment {CommentId} by user {UserId}", commentId, userId);

        var comment = await _unitOfWork.PostComments.GetByIdAsync(commentId, cancellationToken);

        if (comment == null || comment.UserId != userId)
            return false;

        await _unitOfWork.PostComments.DeleteAsync(comment, cancellationToken);

        var post = await _unitOfWork.CommunityPosts.GetByIdAsync(comment.PostId, cancellationToken);
        if (post != null && post.CommentsCount > 0)
        {
            post.CommentsCount--;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
