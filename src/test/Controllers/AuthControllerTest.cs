using Flashcard.Backend.Controllers;
using Flashcard.Backend.Infrastructure;
using Flashcard.Backend.Application.Auth.DTOs;
using Flashcard.Backend.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using Moq;

namespace Backend.Tests.Auth;

public class AuthControllerTests
{
    private AppDbContext GetDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: dbName).Options;
        return new AppDbContext(options);
    }

    private IConfiguration GetConfiguration()
    {
        var inMemorySettings = new Dictionary<string, string?> {
            { "Jwt:Key", "SoManyRandomKeysr!ght@yourdoor!!_makingitLonger"},
            { "Jwt:Issuer", "TestIssuer"},
            { "Jwt:Audience", "TestAudience"}
        };
        return new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
    }

    [Fact]
    public async Task Register_ShouldReturnOk_WhenNewUser()
    {
        using var db = GetDbContext("RegisterTestDb");
        var logger = Mock.Of<ILogger<AuthController>>();
        var config = GetConfiguration();
        var controller = new AuthController(db, config, logger);

        var request = new RegisterRequest { Username = "newuser", Password = "pass123" };
        var result = await controller.Register(request);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponse>(okResult.Value);
        Assert.Equal("newuser", response.Username);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WhenValidCredentials()
    {
        using var db = GetDbContext("LoginTestDb");
        var logger = Mock.Of<ILogger<AuthController>>();
        var config = GetConfiguration();
        db.Users.Add(new User { Username = "testuser", PasswordHash = BCrypt.Net.BCrypt.HashPassword("pass123"), Role = "User" });
        await db.SaveChangesAsync();

        var controller = new AuthController(db, config, logger);
        var request = new LoginRequest { Username = "testuser", Password = "pass123" };
        var result = await controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuthResponse>(okResult.Value);
        Assert.Equal("testuser", response.Username);
    }
}
