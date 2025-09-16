using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Application.Categories.Queries;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.Test.Queries;

public class GetAllCategoriesQueryTest
{
    [Fact]
    public async Task ExecuteAsync_ShouldReturnAllCategories()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: "AllCategoriesTestDb").Options;

        using var db = new AppDbContext(options);
        db.Categories.Add(new Flashcard.Backend.Domain.Category { Id = 1, Name = "C1" });
        db.Categories.Add(new Flashcard.Backend.Domain.Category { Id = 2, Name = "C2" });
        await db.SaveChangesAsync();

        var query = new GetAllCategoriesQuery(db);
        var result = await query.ExecuteAsync();

        Assert.Equal(2, result.Count);
    }
}
