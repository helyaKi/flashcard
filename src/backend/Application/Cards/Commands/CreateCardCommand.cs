using Flashcard.Backend.Domain;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Application.Cards.Commands;

public class CreateCardCommand
{
    private readonly AppDbContext _db;

    public CreateCardCommand(AppDbContext db) => _db = db;

    public async Task<Card?> ExecuteAsync(string question, string answer, int categoryId)
    {
        // Check if category exists
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == categoryId);
        if (!categoryExists)
            return null;

        var card = new Card
        {
            Question = question,
            Answer = answer,
            CategoryId = categoryId
        };

        _db.Cards.Add(card);
        await _db.SaveChangesAsync();
        return card;
    }
}


