using Flashcard.Backend.Domain;
using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Categories.Commands;

public class CreateCategoryCommand
{
    private readonly AppDbContext _db;

    public CreateCategoryCommand(AppDbContext db) => _db = db;

    public async Task<Category> ExecuteAsync(string name)
    {
        var category = new Category { Name = name };
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return category;
    }
}
