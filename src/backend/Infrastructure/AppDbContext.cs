using Flashcard.Backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Card> Cards { get; set; }
}
