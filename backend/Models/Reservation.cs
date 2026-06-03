namespace CinemaTicketSystem.Api.Models;

public class Reservation
{
    public int Id { get; set; }

    public int ScreeningId { get; set; }

    public Screening? Screening { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser? User { get; set; }

    public int Row { get; set; }

    public int Seat { get; set; }

    public DateTime ReservedAt { get; set; } = DateTime.UtcNow;
}