using Microsoft.EntityFrameworkCore;
using Flashcard.Backend.Infrastructure;
using Flashcard.Backend.Application.Categories.Commands;
using Flashcard.Backend.Application.Categories.Queries;
using Flashcard.Backend.Application.Cards.Commands;
using Flashcard.Backend.Application.Cards.Queries;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using System.Security.Claims;


Env.Load();
Console.WriteLine("JWT_KEY from .env: " + Environment.GetEnvironmentVariable("JWT_KEY"));

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register commands and queries
builder.Services.AddScoped<GetAllCategoriesQuery>();
builder.Services.AddScoped<GetCategoryByIdQuery>();
builder.Services.AddScoped<CreateCategoryCommand>();
builder.Services.AddScoped<UpdateCategoryCommand>();
builder.Services.AddScoped<DeleteCategoryCommand>();

builder.Services.AddScoped<GetCardsByCategoryQuery>();
builder.Services.AddScoped<GetCardByIdQuery>();
builder.Services.AddScoped<CreateCardCommand>();
builder.Services.AddScoped<UpdateCardCommand>();
builder.Services.AddScoped<DeleteCardCommand>();

// JWT Authentication
var key = Encoding.UTF8.GetBytes(builder.Configuration["JWT_KEY"] 
          ?? throw new InvalidOperationException("JWT_KEY is missing in .env"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT_ISSUER"],
        ValidAudience = builder.Configuration["JWT_AUDIENCE"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        RoleClaimType = ClaimTypes.Role
    };
});

// Role-based authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("adminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("userOnly", policy => policy.RequireRole("user"));
});

// Add controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
