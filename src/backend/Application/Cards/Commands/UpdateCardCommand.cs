using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Cards.Commands;

public class UpdateCardCommand
{
    private readonly AppDbContext _db;

    public UpdateCardCommand(AppDbContext db) => _db = db;

    public async Task<bool> ExecuteAsync(int id, string question, string answer)
    {
        var card = await _db.Cards.FindAsync(id);
        if (card == null) return false;

        card.Question = question;
        card.Answer = answer;
        await _db.SaveChangesAsync();
        return true;
    }
}
