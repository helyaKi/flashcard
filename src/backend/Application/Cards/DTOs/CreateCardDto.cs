namespace Flashcard.Backend.Application.Cards.DTOs;
public class CreateCardRequestDto
{
    public required string Question { get; set; }
    public required string Answer { get; set; }
    public required int CategoryId { get; set; }
}