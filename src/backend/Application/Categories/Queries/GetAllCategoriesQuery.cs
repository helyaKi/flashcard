using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Application.Categories.Queries;

public class GetAllCategoriesQuery
{
    private readonly AppDbContext _db;

    public GetAllCategoriesQuery(AppDbContext db) => _db = db;

    public async Task<List<CategoryDto>> ExecuteAsync()
    {
        return await _db.Categories
            .Select(c => new CategoryDto { Id = c.Id, Name = c.Name })
            .ToListAsync();
    }
}
