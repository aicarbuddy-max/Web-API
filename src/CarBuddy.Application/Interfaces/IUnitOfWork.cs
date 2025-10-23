using CarBuddy.Domain.Entities;

namespace CarBuddy.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Garage> Garages { get; }
    IRepository<Service> Services { get; }
    IRepository<AutoPartsShop> AutoPartsShops { get; }
    IRepository<CommunityPost> CommunityPosts { get; }
    IRepository<PostLike> PostLikes { get; }
    IRepository<PostComment> PostComments { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
