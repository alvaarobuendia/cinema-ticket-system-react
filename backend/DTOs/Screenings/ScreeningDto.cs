namespace CinemaTicketSystem.Api.DTOs.Screenings;

public class ScreeningDto
{
    public int Id { get; set; }

    public string MovieTitle { get; set; }
        = string.Empty;

    public DateTime StartTime { get; set; }

    public int CinemaId { get; set; }

    public string CinemaName { get; set; }
        = string.Empty;
}