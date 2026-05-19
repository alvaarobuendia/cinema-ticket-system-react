using CinemaTicketSystem.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CinemaTicketSystem.Api.Data;

public class ApplicationDbContext
    : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Cinema> Cinemas => Set<Cinema>();

    public DbSet<Screening> Screenings => Set<Screening>();

    protected override void OnModelCreating(
        ModelBuilder builder
    )
    {
        base.OnModelCreating(builder);

        builder.Entity<Cinema>()
            .Property(c => c.Name)
            .IsRequired();

        builder.Entity<Screening>()
            .Property(s => s.MovieTitle)
            .IsRequired();

        builder.Entity<Screening>()
            .HasOne(s => s.Cinema)
            .WithMany(c => c.Screenings)
            .HasForeignKey(s => s.CinemaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}