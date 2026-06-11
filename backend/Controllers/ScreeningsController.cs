using CinemaTicketSystem.Api.Data;
using CinemaTicketSystem.Api.DTOs.Screenings;
using CinemaTicketSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaTicketSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScreeningsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ScreeningsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetScreenings()
    {
        var screenings = await _context.Screenings
            .Include(s => s.Cinema)
            .OrderBy(s => s.StartTime)
            .Select(s => new ScreeningDto
            {
                Id = s.Id,
                MovieTitle = s.MovieTitle,
                StartTime = s.StartTime,
                CinemaId = s.CinemaId,
                CinemaName = s.Cinema!.Name
            })
            .ToListAsync();

        return Ok(screenings);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateScreening(CreateScreeningDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.MovieTitle))
        {
            return BadRequest(new
            {
                message = "Movie title is required"
            });
        }

        var cinema = await _context.Cinemas
            .FindAsync(dto.CinemaId);

        if (cinema == null)
        {
            return BadRequest(new
            {
                message = "Cinema not found"
            });
        }

        var screening = new Screening
        {
            MovieTitle = dto.MovieTitle.Trim(),
            StartTime = dto.StartTime,
            CinemaId = dto.CinemaId
        };

        _context.Screenings.Add(screening);

        await _context.SaveChangesAsync();

        var result = new ScreeningDto
        {
            Id = screening.Id,
            MovieTitle = screening.MovieTitle,
            StartTime = screening.StartTime,
            CinemaId = screening.CinemaId,
            CinemaName = cinema.Name
        };

        return CreatedAtAction(
            nameof(GetScreenings),
            new { id = screening.Id },
            result
        );
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteScreening(int id)
    {
    var screening = await _context.Screenings.FindAsync(id);

    if (screening == null)
    {
        return NotFound(new
        {
            message = "Screening not found or already deleted"
        });
    }

    _context.Screenings.Remove(screening);

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        return NotFound(new
        {
            message = "Screening was already deleted by another administrator"
        });
    }

    return Ok(new
    {
        message = "Screening deleted successfully"
    });
    }
}