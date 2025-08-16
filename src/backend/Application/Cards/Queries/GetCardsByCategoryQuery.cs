using Flashcard.Backend.Application.Cards.DTOs;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Application.Cards.Queries;

public class GetCardsByCategoryQuery
{
    private readonly AppDbContext _db;

    public GetCardsByCategoryQuery(AppDbContext db) => _db = db;

    public async Task<List<CardDto>> ExecuteAsync(int categoryId)
    {
        return await _db.Cards
            .Where(c => c.CategoryId == categoryId)
            .Select(c => new CardDto
            {
                Id = c.Id,
                Question = c.Question,
                Answer = c.Answer,
                CategoryId = c.CategoryId
            })
            .ToListAsync();
    }
}
