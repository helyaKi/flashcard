using Flashcard.Backend.Application.Cards.Commands;
using Flashcard.Backend.Domain;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;


namespace Backend.Test.Commands;
public class CreateCardCommandTest
{
    [Fact]
    public async Task ExecuteAsync_ShouldCreateCard_WhenCategoryExists()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: "CreateCardTestDb")
        .Options;


        using var db = new AppDbContext(options);
        db.Categories.Add(new Category { Id = 1, Name = "TestCategory" });
        await db.SaveChangesAsync();


        var command = new CreateCardCommand(db);
        var result = await command.ExecuteAsync("Q1", "A1", 1);


        Assert.NotNull(result);
        Assert.Equal("Q1", result!.Question);
    }
}
