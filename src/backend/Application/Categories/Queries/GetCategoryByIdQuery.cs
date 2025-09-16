using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Infrastructure;

namespace Flashcard.Backend.Application.Categories.Queries;

public class GetCategoryByIdQuery
{
    private readonly AppDbContext _db;

    public GetCategoryByIdQuery(AppDbContext db) => _db = db;

    public async Task<ResponseCategoryDto?> ExecuteAsync(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return null;

        return new ResponseCategoryDto { Id = category.Id, Name = category.Name };
    }
}
