namespace Flashcard.Backend.Domain;

public class Card
{
    public int Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = default!;
}
