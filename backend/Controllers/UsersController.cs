using CinemaTicketSystem.Api.Data;
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
    private readonly ApplicationDbContext _context;

    public UsersController(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context
    )
    {
        _userManager = userManager;
        _context = context;
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
        var currentUserId = _userManager.GetUserId(User);
        var isAdmin = User.IsInRole("Admin");

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
        var currentUserId = _userManager.GetUserId(User);
        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && currentUserId != id)
        {
            return Forbid();
        }

        var userExists = await _context.Users.AnyAsync(u => u.Id == id);

        if (!userExists)
        {
            return NotFound();
        }

        var user = new ApplicationUser
        {
            Id = id,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            ConcurrencyStamp = Guid.NewGuid().ToString()
        };

        _context.Users.Attach(user);

        _context.Entry(user)
            .Property(u => u.ConcurrencyStamp)
            .OriginalValue = dto.ConcurrencyStamp;

        _context.Entry(user)
            .Property(u => u.FirstName)
            .IsModified = true;

        _context.Entry(user)
            .Property(u => u.LastName)
            .IsModified = true;

        _context.Entry(user)
            .Property(u => u.PhoneNumber)
            .IsModified = true;

        _context.Entry(user)
            .Property(u => u.ConcurrencyStamp)
            .IsModified = true;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var currentUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (currentUser == null)
            {
                return NotFound();
            }

            return Conflict(new
            {
                message = "User was modified by another user.",
                currentUser = ToUserDto(currentUser)
            });
        }

        var updatedUser = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);

        return Ok(new
        {
            message = "User updated successfully",
            user = ToUserDto(updatedUser!)
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(
        string id,
        [FromQuery] string concurrencyStamp
    )
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == id);

        if (!userExists)
        {
            return NotFound();
        }

        var user = new ApplicationUser
        {
            Id = id,
            ConcurrencyStamp = concurrencyStamp
        };

        _context.Users.Attach(user);

        _context.Entry(user)
            .Property(u => u.ConcurrencyStamp)
            .OriginalValue = concurrencyStamp;

        _context.Users.Remove(user);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var currentUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (currentUser == null)
            {
                return NotFound();
            }

            return Conflict(new
            {
                message = "User was modified before deletion.",
                currentUser = ToUserDto(currentUser)
            });
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