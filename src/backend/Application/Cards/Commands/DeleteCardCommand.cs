using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Cards.Commands;

public class DeleteCardCommand
{
    private readonly AppDbContext _db;

    public DeleteCardCommand(AppDbContext db) => _db = db;

    public async Task<bool> ExecuteAsync(int id)
    {
        var card = await _db.Cards.FindAsync(id);
        if (card == null) return false;

        _db.Cards.Remove(card);
        await _db.SaveChangesAsync();
        return true;
    }
}
