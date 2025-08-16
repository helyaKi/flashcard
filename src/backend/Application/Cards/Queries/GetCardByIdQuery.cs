using Flashcard.Backend.Application.Cards.DTOs;
using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Cards.Queries;

public class GetCardByIdQuery
{
    private readonly AppDbContext _db;

    public GetCardByIdQuery(AppDbContext db) => _db = db;

    public async Task<CardDto?> ExecuteAsync(int id)
    {
        var card = await _db.Cards.FindAsync(id);
        if (card == null) return null;

        return new CardDto
        {
            Id = card.Id,
            Question = card.Question,
            Answer = card.Answer,
            CategoryId = card.CategoryId
        };
    }
}
