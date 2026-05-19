using CinemaTicketSystem.Api.DTOs.Users;
using CinemaTicketSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaTicketSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users.ToListAsync();

        var result = new List<UserDto>();

        foreach (var user in users)
        {
            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                continue;
            }

            result.Add(ToUserDto(user));
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var currentUserId =
            _userManager.GetUserId(User);

        var isAdmin =
            User.IsInRole("Admin");

        if (!isAdmin && currentUserId != id)
        {
            return Forbid();
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(ToUserDto(user));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        string id,
        UpdateUserDto dto
    )
    {
        var currentUserId =
            _userManager.GetUserId(User);

        var isAdmin =
            User.IsInRole("Admin");

        if (!isAdmin && currentUserId != id)
        {
            return Forbid();
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        if (user.ConcurrencyStamp != dto.ConcurrencyStamp)
        {
            return Conflict(new
            {
                message = "User was modified by another user.",
                currentUser = ToUserDto(user)
            });
        }

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.PhoneNumber;
        user.ConcurrencyStamp = Guid.NewGuid().ToString();

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new
        {
            message = "User updated successfully",
            user = ToUserDto(user)
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(
        string id,
        [FromQuery] string concurrencyStamp
    )
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        if (user.ConcurrencyStamp != concurrencyStamp)
        {
            return Conflict(new
            {
                message = "User was modified before deletion.",
                currentUser = ToUserDto(user)
            });
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new
        {
            message = "User deleted successfully"
        });
    }

    private static UserDto ToUserDto(ApplicationUser user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            ConcurrencyStamp = user.ConcurrencyStamp ?? string.Empty
        };
    }
}