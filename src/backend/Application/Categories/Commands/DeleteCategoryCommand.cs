using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Categories.Commands;

public class DeleteCategoryCommand
{
    private readonly AppDbContext _db;

    public DeleteCategoryCommand(AppDbContext db) => _db = db;

    public async Task<bool> ExecuteAsync(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return false;

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return true;
    }
}
