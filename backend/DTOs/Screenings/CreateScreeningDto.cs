namespace CinemaTicketSystem.Api.DTOs.Screenings;

public class CreateScreeningDto
{
    public string MovieTitle { get; set; }
        = string.Empty;

    public DateTime StartTime { get; set; }

    public int CinemaId { get; set; }
}