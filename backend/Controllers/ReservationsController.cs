using System.Security.Claims;
using CinemaTicketSystem.Api.Data;
using CinemaTicketSystem.Api.DTOs.Reservations;
using CinemaTicketSystem.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaTicketSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReservationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("screening/{screeningId}/occupancy")]
    public async Task<IActionResult> GetOccupancy(int screeningId)
    {
        var userId = GetCurrentUserId();

        var screening = await _context.Screenings
            .Include(s => s.Cinema)
            .FirstOrDefaultAsync(s => s.Id == screeningId);

        if (screening == null)
        {
            return NotFound(new
            {
                message = "Screening not found"
            });
        }

        if (screening.Cinema == null)
        {
            return BadRequest(new
            {
                message = "Cinema not found for this screening"
            });
        }

        var reservations = await _context.Reservations
            .Where(r => r.ScreeningId == screeningId)
            .ToListAsync();

        var seats = new List<SeatDto>();

        for (var row = 1; row <= screening.Cinema.Rows; row++)
        {
            for (var seat = 1; seat <= screening.Cinema.SeatsPerRow; seat++)
            {
                var reservation = reservations.FirstOrDefault(r =>
                    r.Row == row &&
                    r.Seat == seat
                );

                seats.Add(new SeatDto
                {
                    Row = row,
                    Seat = seat,
                    IsReserved = reservation != null,
                    IsMine = reservation != null &&
                             reservation.UserId == userId
                });
            }
        }

        return Ok(new RoomOccupancyDto
        {
            ScreeningId = screening.Id,
            Rows = screening.Cinema.Rows,
            SeatsPerRow = screening.Cinema.SeatsPerRow,
            Seats = seats
        });
    }

    [HttpPost("screening/{screeningId}/reserve")]
    public async Task<IActionResult> ReserveSeat(
        int screeningId,
        ReserveSeatDto dto
    )
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var screening = await _context.Screenings
            .Include(s => s.Cinema)
            .FirstOrDefaultAsync(s => s.Id == screeningId);

        if (screening == null)
        {
            return NotFound(new
            {
                message = "Screening not found"
            });
        }

        if (screening.Cinema == null)
        {
            return BadRequest(new
            {
                message = "Cinema not found for this screening"
            });
        }

        if (!IsSeatInsideRoom(
                dto.Row,
                dto.Seat,
                screening.Cinema.Rows,
                screening.Cinema.SeatsPerRow
            ))
        {
            return BadRequest(new
            {
                message = "Seat is outside the room"
            });
        }

        var reservation = new Reservation
        {
            ScreeningId = screeningId,
            UserId = userId,
            Row = dto.Row,
            Seat = dto.Seat,
            ReservedAt = DateTime.UtcNow
        };

        _context.Reservations.Add(reservation);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new
            {
                message = "Seat is already reserved"
            });
        }

        return Ok(new
        {
            message = "Seat reserved successfully"
        });
    }

    [HttpDelete("screening/{screeningId}/cancel")]
    public async Task<IActionResult> CancelReservation(
        int screeningId,
        ReserveSeatDto dto
    )
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(r =>
                r.ScreeningId == screeningId &&
                r.Row == dto.Row &&
                r.Seat == dto.Seat
            );

        if (reservation == null)
        {
            return NotFound(new
            {
                message = "Reservation not found"
            });
        }

        if (reservation.UserId != userId && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        _context.Reservations.Remove(reservation);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Reservation cancelled successfully"
        });
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    private static bool IsSeatInsideRoom(
        int row,
        int seat,
        int rows,
        int seatsPerRow
    )
    {
        return row >= 1 &&
               row <= rows &&
               seat >= 1 &&
               seat <= seatsPerRow;
    }
}