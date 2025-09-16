using Flashcard.Backend.Application.Cards.DTOs;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Application.Cards.Queries;

public class GetCardsByCategoryQuery
{
    private readonly AppDbContext _db;

    public GetCardsByCategoryQuery(AppDbContext db) => _db = db;

    public async Task<(List<ResponseCardDto> Data, int TotalCount)> ExecuteAsync(
    int categoryId, int page, int pageSize, string? search = null)
{
    var query = _db.Cards
        .Where(c => c.CategoryId == categoryId);

    if (!string.IsNullOrWhiteSpace(search))
    {
        query = query.Where(c => 
            c.Question.Contains(search) || 
            c.Answer.Contains(search));
    }

    var totalCount = await query.CountAsync();

    var data = await query
        .OrderBy(c => c.Id)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(c => new ResponseCardDto
        {
            Id = c.Id,
            Question = c.Question,
            Answer = c.Answer,
            CategoryId = c.CategoryId
        })
        .ToListAsync();

    return (data, totalCount);
}

}
