using CinemaTicketSystem.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaTicketSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CinemasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CinemasController(
        ApplicationDbContext context
    )
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCinemas()
    {
        var cinemas = await _context.Cinemas
            .ToListAsync();

        return Ok(cinemas);
    }
}