using System.ComponentModel.DataAnnotations;

namespace Flashcard.Backend.Domain;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    private string _role = string.Empty;

    [Required]
    public string Role
    {
        get => _role;
        set => _role = value?.ToLower() ?? string.Empty;
    }
}
