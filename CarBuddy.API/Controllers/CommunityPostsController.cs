using System.Security.Claims;
using CarBuddy.Application.DTOs.CommunityPost;
using CarBuddy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarBuddy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommunityPostsController : ControllerBase
{
    private readonly ICommunityPostService _communityPostService;
    private readonly ILogger<CommunityPostsController> _logger;

    public CommunityPostsController(ICommunityPostService communityPostService, ILogger<CommunityPostsController> logger)
    {
        _communityPostService = communityPostService;
        _logger = logger;
    }

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userIdClaim != null ? Guid.Parse(userIdClaim) : null;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommunityPostDto>>> GetAll(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching all community posts");
        var currentUserId = GetCurrentUserId();
        var posts = await _communityPostService.GetAllPostsAsync(currentUserId, cancellationToken);
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CommunityPostDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching community post: {PostId}", id);
        var currentUserId = GetCurrentUserId();
        var post = await _communityPostService.GetPostByIdAsync(id, currentUserId, cancellationToken);

        if (post == null)
            return NotFound(new { message = "Post not found" });

        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CommunityPostDto>> Create([FromBody] CreatePostDto dto, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        _logger.LogInformation("Creating new community post for user: {UserId}", userId);
        var post = await _communityPostService.CreatePostAsync(userId.Value, dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        _logger.LogInformation("Deleting community post: {PostId}", id);
        var result = await _communityPostService.DeletePostAsync(id, userId.Value, cancellationToken);

        if (!result)
            return NotFound(new { message = "Post not found or you don't have permission to delete it" });

        return NoContent();
    }

    [Authorize]
    [HttpPost("{id}/like")]
    public async Task<IActionResult> Like(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        _logger.LogInformation("User {UserId} liking post {PostId}", userId, id);
        var result = await _communityPostService.LikePostAsync(id, userId.Value, cancellationToken);

        if (!result)
            return BadRequest(new { message = "Post already liked or not found" });

        return Ok(new { message = "Post liked successfully" });
    }

    [Authorize]
    [HttpDelete("{id}/like")]
    public async Task<IActionResult> Unlike(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        _logger.LogInformation("User {UserId} unliking post {PostId}", userId, id);
        var result = await _communityPostService.UnlikePostAsync(id, userId.Value, cancellationToken);

        if (!result)
            return BadRequest(new { message = "Post not liked or not found" });

        return Ok(new { message = "Post unliked successfully" });
    }

    [HttpGet("{id}/comments")]
    public async Task<ActionResult<IEnumerable<PostCommentDto>>> GetComments(Guid id, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Fetching comments for post: {PostId}", id);
        var comments = await _communityPostService.GetPostCommentsAsync(id, cancellationToken);
        return Ok(comments);
    }

    [Authorize]
    [HttpPost("{id}/comments")]
    public async Task<ActionResult<PostCommentDto>> AddComment(Guid id, [FromBody] CreateCommentDto dto, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        _logger.LogInformation("Adding comment to post {PostId} by user {UserId}", id, userId);
        var comment = await _communityPostService.AddCommentAsync(id, userId.Value, dto, cancellationToken);
        return CreatedAtAction(nameof(GetComments), new { id }, comment);
    }

    [Authorize]
    [HttpDelete("comments/{commentId}")]
    public async Task<IActionResult> DeleteComment(Guid commentId, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        _logger.LogInformation("Deleting comment {CommentId} by user {UserId}", commentId, userId);
        var result = await _communityPostService.DeleteCommentAsync(commentId, userId.Value, cancellationToken);

        if (!result)
            return NotFound(new { message = "Comment not found or you don't have permission to delete it" });

        return NoContent();
    }
}
