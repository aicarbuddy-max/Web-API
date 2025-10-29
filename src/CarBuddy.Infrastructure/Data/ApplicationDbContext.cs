using CarBuddy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarBuddy.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Garage> Garages { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;
    public DbSet<AutoPartsShop> AutoPartsShops { get; set; } = null!;
    public DbSet<CommunityPost> CommunityPosts { get; set; } = null!;
    public DbSet<PostLike> PostLikes { get; set; } = null!;
    public DbSet<PostComment> PostComments { get; set; } = null!;
    public DbSet<ContactMessage> ContactMessages { get; set; } = null!;
    public DbSet<ServiceBooking> ServiceBookings { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<UserAddress> UserAddresses { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.PhoneNumber).IsUnique();
        });

        // Garage configuration
        modelBuilder.Entity<Garage>(entity =>
        {
            entity.ToTable("garages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Rating).HasPrecision(3, 2);
            entity.HasMany(e => e.Services)
                  .WithOne(e => e.Garage)
                  .HasForeignKey(e => e.GarageId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Service configuration
        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Price).HasPrecision(18, 2);
        });

        // AutoPartsShop configuration
        modelBuilder.Entity<AutoPartsShop>(entity =>
        {
            entity.ToTable("autopartsshops");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Rating).HasPrecision(3, 2);
        });

        // CommunityPost configuration
        modelBuilder.Entity<CommunityPost>(entity =>
        {
            entity.ToTable("communityposts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PostLike configuration
        modelBuilder.Entity<PostLike>(entity =>
        {
            entity.ToTable("postlikes");
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Post)
                  .WithMany(p => p.Likes)
                  .HasForeignKey(e => e.PostId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasIndex(e => new { e.PostId, e.UserId }).IsUnique();
        });

        // PostComment configuration
        modelBuilder.Entity<PostComment>(entity =>
        {
            entity.ToTable("postcomments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
            entity.HasOne(e => e.Post)
                  .WithMany(p => p.Comments)
                  .HasForeignKey(e => e.PostId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ContactMessage configuration
        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.ToTable("contactmessages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(2000);
        });

        // ServiceBooking configuration
        modelBuilder.Entity<ServiceBooking>(entity =>
        {
            entity.ToTable("servicebookings");
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Service)
                  .WithMany()
                  .HasForeignKey(e => e.ServiceId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.Garage)
                  .WithMany()
                  .HasForeignKey(e => e.GarageId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("reviews");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Comment).IsRequired().HasMaxLength(1000);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Garage)
                  .WithMany()
                  .HasForeignKey(e => e.GarageId)
                  .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.AutoPartsShop)
                  .WithMany()
                  .HasForeignKey(e => e.AutoPartsShopId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // UserAddress configuration
        modelBuilder.Entity<UserAddress>(entity =>
        {
            entity.ToTable("useraddresses");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Label).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
