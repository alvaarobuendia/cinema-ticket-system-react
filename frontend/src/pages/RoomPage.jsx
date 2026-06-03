import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../services/api";

export default function RoomPage() {

    const { screeningId } =
        useParams();

    const [room, setRoom] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const fetchRoom = useCallback(async () => {

        try {

            const response =
                await api.get(
                    `/reservations/screening/${screeningId}/occupancy`
                );

            setRoom(
                response.data
            );
        }
        catch {

            setError(
                "Failed to load room occupancy."
            );
        }
        finally {

            setLoading(false);
        }

    }, [screeningId]);

    useEffect(() => {

        fetchRoom();

    }, [fetchRoom]);

    const getSeat = (
        row,
        seat
    ) => {

        return room.seats.find(
            (s) =>
                s.row === row &&
                s.seat === seat
        );
    };

    const handleSeatClick = async (
        selectedSeat
    ) => {

        setMessage("");
        setError("");

        try {

            if (selectedSeat.isMine) {

                await api.delete(
                    `/reservations/screening/${screeningId}/cancel`,
                    {
                        data: {
                            row: selectedSeat.row,
                            seat: selectedSeat.seat
                        }
                    }
                );

                setMessage(
                    "Reservation cancelled successfully."
                );
            }
            else if (!selectedSeat.isReserved) {

                await api.post(
                    `/reservations/screening/${screeningId}/reserve`,
                    {
                        row: selectedSeat.row,
                        seat: selectedSeat.seat
                    }
                );

                setMessage(
                    "Seat reserved successfully."
                );
            }
            else {

                setError(
                    "This seat is already reserved."
                );

                return;
            }

            await fetchRoom();
        }
        catch (err) {

            if (err.response?.status === 409) {

                setError(
                    "This seat has just been reserved by another user."
                );
            }
            else if (err.response?.status === 403) {

                setError(
                    "You cannot cancel another user's reservation."
                );
            }
            else {

                setError(
                    "Operation failed."
                );
            }

            await fetchRoom();
        }
    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="container mt-5">
                    <p>
                        Loading room...
                    </p>
                </div>
            </>
        );
    }

    if (!room) {

        return (
            <>
                <Navbar />

                <div className="container mt-5">

                    <div className="alert alert-danger">
                        {error || "Room not found."}
                    </div>

                    <Link
                        to="/screenings"
                        className="btn btn-secondary"
                    >
                        Back to screenings
                    </Link>

                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>
                        Room occupancy
                    </h2>

                    <Link
                        to="/screenings"
                        className="btn btn-secondary"
                    >
                        Back to screenings
                    </Link>

                </div>

                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="mb-3">

                    <span className="badge bg-success me-2">
                        Free
                    </span>

                    <span className="badge bg-primary me-2">
                        Your reservation
                    </span>

                    <span className="badge bg-danger">
                        Occupied
                    </span>

                </div>

                <div className="mb-4">
                    <strong>
                        Screen
                    </strong>

                    <div
                        className="border border-dark mt-2 mb-4"
                        style={{
                            height: "10px",
                            maxWidth: "700px"
                        }}
                    />
                </div>

                <div
                    className="table-responsive"
                    style={{
                        maxWidth: "100%"
                    }}
                >

                    <table className="table table-borderless text-center">

                        <tbody>

                            {
                                Array.from(
                                    {
                                        length: room.rows
                                    },
                                    (_, rowIndex) => {

                                        const row =
                                            rowIndex + 1;

                                        return (
                                            <tr key={row}>

                                                <td className="fw-bold">
                                                    Row {row}
                                                </td>

                                                {
                                                    Array.from(
                                                        {
                                                            length: room.seatsPerRow
                                                        },
                                                        (_, seatIndex) => {

                                                            const seatNumber =
                                                                seatIndex + 1;

                                                            const selectedSeat =
                                                                getSeat(
                                                                    row,
                                                                    seatNumber
                                                                );

                                                            const buttonClass =
                                                                selectedSeat.isMine
                                                                    ? "btn btn-primary btn-sm"
                                                                    : selectedSeat.isReserved
                                                                        ? "btn btn-danger btn-sm"
                                                                        : "btn btn-success btn-sm";

                                                            return (
                                                                <td key={seatNumber}>

                                                                    <button
                                                                        type="button"
                                                                        className={buttonClass}
                                                                        style={{
                                                                            width: "42px"
                                                                        }}
                                                                        onClick={() =>
                                                                            handleSeatClick(
                                                                                selectedSeat
                                                                            )
                                                                        }
                                                                    >
                                                                        {seatNumber}
                                                                    </button>

                                                                </td>
                                                            );
                                                        }
                                                    )
                                                }

                                            </tr>
                                        );
                                    }
                                )
                            }

                        </tbody>

                    </table>

                </div>

                <p className="text-muted mt-3">
                    Click a free seat to reserve it. Click your own reserved seat to cancel it.
                </p>

            </div>
        </>
    );
}