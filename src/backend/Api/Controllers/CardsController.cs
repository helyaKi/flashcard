using Flashcard.Backend.Application.Cards.Commands;
using Flashcard.Backend.Application.Cards.DTOs;
using Flashcard.Backend.Application.Cards.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Flashcard.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly GetCardsByCategoryQuery _getCardsByCategory;
    private readonly GetCardByIdQuery _getCardById;
    private readonly CreateCardCommand _createCard;
    private readonly UpdateCardCommand _updateCard;
    private readonly DeleteCardCommand _deleteCard;

    public CardsController(
        GetCardsByCategoryQuery getCardsByCategory,
        GetCardByIdQuery getCardById,
        CreateCardCommand createCard,
        UpdateCardCommand updateCard,
        DeleteCardCommand deleteCard)
    {
        _getCardsByCategory = getCardsByCategory;
        _getCardById = getCardById;
        _createCard = createCard;
        _updateCard = updateCard;
        _deleteCard = deleteCard;
    }

    // Filter cards by categoryId
    [HttpGet("{categoryId}")]
    public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsByCategory(int categoryId)
    {
        var cards = await _getCardsByCategory.ExecuteAsync(categoryId);
        return Ok(cards);
    }

    [HttpGet("single/{id}")]
    public async Task<ActionResult<CardDto>> GetCardById(int id)
    {
        var card = await _getCardById.ExecuteAsync(id);
        if (card == null) return NotFound();
        return Ok(card);
    }

    [HttpPost]
    public async Task<ActionResult<CardDto>> CreateCard([FromBody] CardDto dto)
    {
        var card = await _createCard.ExecuteAsync(dto.Question, dto.Answer, dto.CategoryId);
    
        // If category doesn't exist
        if (card == null)
            return BadRequest($"Category with ID '{dto.CategoryId}' does not exist.");

        return CreatedAtAction(nameof(GetCardById), new { id = card.Id }, card);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCard(int id, [FromBody] CardDto dto)
    {
        var updated = await _updateCard.ExecuteAsync(id, dto.Question, dto.Answer);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCard(int id)
    {
        var deleted = await _deleteCard.ExecuteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
