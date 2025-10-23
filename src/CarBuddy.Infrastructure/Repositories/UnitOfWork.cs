using CarBuddy.Application.Interfaces;
using CarBuddy.Domain.Entities;
using CarBuddy.Infrastructure.Data;

namespace CarBuddy.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IRepository<User>? _users;
    private IRepository<Garage>? _garages;
    private IRepository<Service>? _services;
    private IRepository<AutoPartsShop>? _autoPartsShops;
    private IRepository<CommunityPost>? _communityPosts;
    private IRepository<PostLike>? _postLikes;
    private IRepository<PostComment>? _postComments;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<User> Users => _users ??= new Repository<User>(_context);
    public IRepository<Garage> Garages => _garages ??= new Repository<Garage>(_context);
    public IRepository<Service> Services => _services ??= new Repository<Service>(_context);
    public IRepository<AutoPartsShop> AutoPartsShops => _autoPartsShops ??= new Repository<AutoPartsShop>(_context);
    public IRepository<CommunityPost> CommunityPosts => _communityPosts ??= new Repository<CommunityPost>(_context);
    public IRepository<PostLike> PostLikes => _postLikes ??= new Repository<PostLike>(_context);
    public IRepository<PostComment> PostComments => _postComments ??= new Repository<PostComment>(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
