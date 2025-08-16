using Microsoft.EntityFrameworkCore;
using Flashcard.Backend.Infrastructure;
using Flashcard.Backend.Application.Categories.Commands;
using Flashcard.Backend.Application.Categories.Queries;
using Flashcard.Backend.Application.Cards.Commands;
using Flashcard.Backend.Application.Cards.Queries;

var builder = WebApplication.CreateBuilder(args);

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

app.MapControllers();
app.Run();
