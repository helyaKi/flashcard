namespace Flashcard.Backend.Application.Cards.DTOs;

public class CardDto
{
    public required int Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public required int CategoryId { get; set; }
}
