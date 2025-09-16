using System.ComponentModel.DataAnnotations;

namespace Flashcard.Backend.Application.Auth.DTOs;

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    private string _role = string.Empty;

    [Required]
    public string Role
    {
        get => _role;
        set => _role = value?.ToLower() ?? string.Empty;
    }
}
