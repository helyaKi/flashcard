namespace Flashcard.Backend.Domain;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Card> Cards { get; set; } = new();
}
