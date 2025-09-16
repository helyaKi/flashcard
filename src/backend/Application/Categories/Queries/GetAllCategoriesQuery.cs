using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Application.Categories.Queries;

public class GetAllCategoriesQuery
{
    private readonly AppDbContext _db;

    public GetAllCategoriesQuery(AppDbContext db) => _db = db;

    public async Task<(List<ResponseCategoryDto> Data, int TotalCount)> ExecuteAsync(
    int page, int pageSize, string? search = null)
{
    var query = _db.Categories.AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
        query = query.Where(c => c.Name.Contains(search));
    }

    var totalCount = await query.CountAsync();

    var data = await query
        .OrderBy(c => c.Id)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(c => new ResponseCategoryDto
        {
            Id = c.Id,
            Name = c.Name
        })
        .ToListAsync();

    return (data, totalCount);
}

}
