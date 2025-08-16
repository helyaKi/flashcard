using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Categories.Commands;

public class UpdateCategoryCommand
{
    private readonly AppDbContext _db;

    public UpdateCategoryCommand(AppDbContext db) => _db = db;

    public async Task<bool> ExecuteAsync(int id, string newName)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return false;

        category.Name = newName;
        await _db.SaveChangesAsync();
        return true;
    }
}
