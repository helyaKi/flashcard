using Flashcard.Backend.Application.Cards.Commands;
using Flashcard.Backend.Application.Cards.DTOs;
using Flashcard.Backend.Application.Cards.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Flashcard.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CardsController : ControllerBase
{
    private readonly GetCardsByCategoryQuery _getCardsByCategory;
    private readonly GetCardByIdQuery _getCardById;
    private readonly CreateCardCommand _createCard;
    private readonly UpdateCardCommand _updateCard;
    private readonly DeleteCardCommand _deleteCard;
    private readonly ILogger<CardsController> _logger;

    public CardsController(
        GetCardsByCategoryQuery getCardsByCategory,
        GetCardByIdQuery getCardById,
        CreateCardCommand createCard,
        UpdateCardCommand updateCard,
        DeleteCardCommand deleteCard,
        ILogger<CardsController> logger)
    {
        _getCardsByCategory = getCardsByCategory;
        _getCardById = getCardById;
        _createCard = createCard;
        _updateCard = updateCard;
        _deleteCard = deleteCard;
        _logger = logger;
    }

    [HttpGet("{categoryId}")]
    [Authorize]
public async Task<IActionResult> GetCardsByCategory(
    int categoryId,
    [FromQuery] string? search = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 12)
{
    try
    {
        var (cards, totalCount) = await _getCardsByCategory.ExecuteAsync(categoryId, page, pageSize, search);

        return Ok(new
        {
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            Data = cards
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching cards for category {CategoryId}", categoryId);
        return StatusCode(500, "An error occurred while retrieving cards.");
    }
}


    [HttpGet("single/{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseCardDto>> GetCardById(int id)
    {
        try
        {
            var card = await _getCardById.ExecuteAsync(id);
            if (card == null)
                return NotFound($"Card with ID {id} not found.");

            return Ok(card);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching card with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the card.");
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseCardDto>> CreateCard([FromBody] CreateCardRequestDto request)
    {
        try
        {
            var card = await _createCard.ExecuteAsync(request.Question, request.Answer, request.CategoryId);

            if (card == null)
                return BadRequest($"Category with ID '{request.CategoryId}' does not exist.");

            var result = new ResponseCardDto
            {
                Id = card.Id,
                Question = card.Question,
                Answer = card.Answer,
                CategoryId = card.CategoryId
            };

            _logger.LogInformation("Card created with ID {Id}", card.Id);

            return CreatedAtAction(nameof(GetCardById), new { id = card.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating card.");
            return StatusCode(500, "An error occurred while creating the card.");
        }
    }

    [HttpPut("{id}")]
[Authorize(Roles = "admin")]
public async Task<ActionResult<ResponseCardDto>> UpdateCard(int id, [FromBody] UpdateCardRequestDto request)
{
    try
    {
        var updatedCard = await _updateCard.ExecuteAsync(id, request.Question, request.Answer);
        if (updatedCard == null)
            return NotFound($"Card with ID {id} not found.");

        var result = new ResponseCardDto
        {
            Id = updatedCard.Id,
            Question = updatedCard.Question,
            Answer = updatedCard.Answer,
            CategoryId = updatedCard.CategoryId
        };

        _logger.LogInformation("Card with ID {Id} updated successfully", id);
        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error updating card with ID {Id}", id);
        return StatusCode(500, "An error occurred while updating the card.");
    }
}


    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteCard(int id)
    {
        try
        {
            var deleted = await _deleteCard.ExecuteAsync(id);
            if (!deleted)
                return NotFound($"Card with ID {id} not found.");

            _logger.LogInformation("Card with ID {Id} deleted successfully", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting card with ID {Id}", id);
            return StatusCode(500, "An error occurred while deleting the card.");
        }
    }
}
