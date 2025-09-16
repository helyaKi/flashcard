using Flashcard.Backend.Application.Cards.DTOs;
using Flashcard.Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Flashcard.Backend.Application.Cards.Queries;

public class GetAllCardsQuery
{
    private readonly AppDbContext _db;

    public GetAllCardsQuery(AppDbContext db) => _db = db;

    public async Task<List<ResponseCardDto>> ExecuteAsync()
    {
        return await _db.Cards
            .Select(c => new ResponseCardDto
            {
                Id = c.Id,
                Question = c.Question,
                Answer = c.Answer,
                CategoryId = c.CategoryId
            })
            .ToListAsync();
    }
}
