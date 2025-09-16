namespace Flashcard.Backend.Application.Cards.DTOs;

public class UpdateCardRequestDto
{
    public required int Id { get; set; }
    public required string Question { get; set; }
    public required string Answer { get; set; }
    public required int CategoryId { get; set; }
}
