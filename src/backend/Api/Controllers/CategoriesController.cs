using Flashcard.Backend.Application.Categories.Commands;
using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Application.Categories.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Flashcard.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly GetAllCategoriesQuery _getAllCategories;
    private readonly GetCategoryByIdQuery _getCategoryById;
    private readonly CreateCategoryCommand _createCategory;
    private readonly UpdateCategoryCommand _updateCategory;
    private readonly DeleteCategoryCommand _deleteCategory;

    public CategoriesController(
        GetAllCategoriesQuery getAllCategories,
        GetCategoryByIdQuery getCategoryById,
        CreateCategoryCommand createCategory,
        UpdateCategoryCommand updateCategory,
        DeleteCategoryCommand deleteCategory)
    {
        _getAllCategories = getAllCategories;
        _getCategoryById = getCategoryById;
        _createCategory = createCategory;
        _updateCategory = updateCategory;
        _deleteCategory = deleteCategory;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _getAllCategories.ExecuteAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
    {
        var category = await _getCategoryById.ExecuteAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] string name)
    {
        var category = await _createCategory.ExecuteAsync(name);
        return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] string newName)
    {
        var updated = await _updateCategory.ExecuteAsync(id, newName);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var deleted = await _deleteCategory.ExecuteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
