namespace CinemaTicketSystem.Api.DTOs.Reservations;

public class SeatDto
{
    public int Row { get; set; }

    public int Seat { get; set; }

    public bool IsReserved { get; set; }

    public bool IsMine { get; set; }
}

public class RoomOccupancyDto
{
    public int ScreeningId { get; set; }

    public int Rows { get; set; }

    public int SeatsPerRow { get; set; }

    public List<SeatDto> Seats { get; set; } = new();
}

public class ReserveSeatDto
{
    public int Row { get; set; }

    public int Seat { get; set; }
}