using Flashcard.Backend.Application.Cards.Commands;
using Flashcard.Backend.Domain;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Backend.Test.Commands;
public class DeleteCardCommandTest
{
    [Fact]
    public async Task ExecuteAsync_ShouldDeleteCard_WhenCardExists()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: "DeleteCardTestDb")
        .Options;


        using var db = new AppDbContext(options);
        var card = new Card { Id = 1, Question = "Q", Answer = "A", CategoryId = 1 };
        db.Cards.Add(card);
        await db.SaveChangesAsync();


        var command = new DeleteCardCommand(db);
        var result = await command.ExecuteAsync(1);


        Assert.True(result);
        Assert.Empty(db.Cards);
    }
}