using Flashcard.Backend.Application.Categories.Commands;
using Flashcard.Backend.Application.Categories.DTOs;
using Flashcard.Backend.Application.Categories.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Flashcard.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly GetAllCategoriesQuery _getAllCategories;
    private readonly GetCategoryByIdQuery _getCategoryById;
    private readonly CreateCategoryCommand _createCategory;
    private readonly UpdateCategoryCommand _updateCategory;
    private readonly DeleteCategoryCommand _deleteCategory;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(
        GetAllCategoriesQuery getAllCategories,
        GetCategoryByIdQuery getCategoryById,
        CreateCategoryCommand createCategory,
        UpdateCategoryCommand updateCategory,
        DeleteCategoryCommand deleteCategory,
        ILogger<CategoriesController> logger)
    {
        _getAllCategories = getAllCategories;
        _getCategoryById = getCategoryById;
        _createCategory = createCategory;
        _updateCategory = updateCategory;
        _deleteCategory = deleteCategory;
        _logger = logger;
    }

    [HttpGet]
[Authorize]
public async Task<IActionResult> GetCategories(
    [FromQuery] string? search = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 12)
{
    try
    {
        var (categories, totalCount) = await _getAllCategories.ExecuteAsync(page, pageSize, search);

        return Ok(new
        {
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            Data = categories
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching categories.");
        return StatusCode(500, "An error occurred while retrieving categories.");
    }
}


    [HttpGet("{id}")]
  [Authorize]
    public async Task<ActionResult<ResponseCategoryDto>> GetCategoryById(int id)
    {
        try
        {
            var category = await _getCategoryById.ExecuteAsync(id);
            if (category == null)
                return NotFound($"Category with ID {id} not found.");

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching category with ID {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the category.");
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseCategoryDto>> CreateCategory([FromBody] CreateCategoryRequestDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Category name is required.");

            var category = await _createCategory.ExecuteAsync(request.Name);

            var result = new ResponseCategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };

            _logger.LogInformation("Category created with ID {Id}", category.Id);

            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category.");
            return StatusCode(500, "An error occurred while creating the category.");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequestDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("New category name is required.");

            var updated = await _updateCategory.ExecuteAsync(id, request.Name);
            if (!updated)
                return NotFound($"Category with ID {id} not found.");

            _logger.LogInformation("Category with ID {Id} updated successfully", id);
            var result = new ResponseCategoryDto
            {
                Id = id,
                Name = request.Name
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category with ID {Id}", id);
            return StatusCode(500, "An error occurred while updating the category.");
        }
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        try
        {
            var deleted = await _deleteCategory.ExecuteAsync(id);
            if (!deleted)
                return NotFound($"Category with ID {id} not found.");

            _logger.LogInformation("Category with ID {Id} deleted successfully", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category with ID {Id}", id);
            return StatusCode(500, "An error occurred while deleting the category.");
        }
    }
}
