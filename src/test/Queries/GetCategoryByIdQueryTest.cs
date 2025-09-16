using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Application.Categories.Queries;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Backend.Test.Queries;

public class GetCategoryByIdQueryTest
{
    [Fact]
    public async Task ExecuteAsync_ShouldReturnCategory_WhenExists()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: "CategoryByIdTestDb").Options;

        using var db = new AppDbContext(options);
        db.Categories.Add(new Flashcard.Backend.Domain.Category { Id = 1, Name = "C1" });
        await db.SaveChangesAsync();

        var query = new GetCategoryByIdQuery(db);
        var result = await query.ExecuteAsync(1);

        Assert.NotNull(result);
        Assert.Equal("C1", result!.Name);
    }
}
