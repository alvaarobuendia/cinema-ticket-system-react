import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../services/api";

import { isAdmin } from "../services/auth";

export default function ScreeningsPage() {

    const [screenings, setScreenings] =
        useState([]);

    const [cinemas, setCinemas] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [formData, setFormData] =
        useState({
            movieTitle: "",
            startTime: "",
            cinemaId: 1
        });

    const fetchData = async () => {

        try {

            const screeningsResponse =
                await api.get(
                    "/screenings"
                );

            const cinemasResponse =
                await api.get(
                    "/cinemas"
                );

            setScreenings(
                screeningsResponse.data
            );

            setCinemas(
                cinemasResponse.data
            );
        }
        catch {

            setError(
                "Failed to load data."
            );
        }
        finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchData();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.name === "cinemaId"
                    ? Number(e.target.value)
                    : e.target.value
        });
    };

    const handleCreate = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            await api.post(
                "/screenings",
                formData
            );

            setFormData({
                movieTitle: "",
                startTime: "",
                cinemaId: 1
            });

            setShowCreateForm(false);

            await fetchData();

            setMessage(
                "Screening created successfully."
            );
        }
        catch {

            setError(
                "Failed to create screening."
            );
        }
    };

    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Delete screening?"
            );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await api.delete(
                `/screenings/${id}`
            );

            await fetchData();

            setMessage(
                "Screening deleted successfully."
            );
        }
        catch {

            setError(
                "Failed to delete screening."
            );
        }
    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="container mt-5">
                    <p>
                        Loading screenings...
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2 className="mb-4">
                    Screenings
                </h2>

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

                {isAdmin() && (
                    <div className="mb-4">

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                setShowCreateForm(
                                    !showCreateForm
                                )
                            }
                        >
                            {
                                showCreateForm
                                    ? "Cancel"
                                    : "Create Screening"
                            }
                        </button>

                    </div>
                )}

                {isAdmin() && showCreateForm && (

                    <div className="card mb-5">

                        <div className="card-body">

                            <h4 className="mb-3">
                                Create Screening
                            </h4>

                            <form onSubmit={handleCreate}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Movie Title
                                    </label>

                                    <input
                                        type="text"
                                        name="movieTitle"
                                        className="form-control"
                                        value={formData.movieTitle}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Start Time
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        className="form-control"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Cinema
                                    </label>

                                    <select
                                        name="cinemaId"
                                        className="form-select"
                                        value={formData.cinemaId}
                                        onChange={handleChange}
                                    >

                                        {cinemas.map(
                                            (cinema) => (

                                                <option
                                                    key={cinema.id}
                                                    value={cinema.id}
                                                >
                                                    {cinema.name}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Save Screening
                                </button>

                            </form>

                        </div>

                    </div>
                )}

                <div className="row">

                    {
                        screenings.length === 0
                            ? (
                                <p>
                                    No screenings available.
                                </p>
                            )
                            : (
                                screenings.map(
                                    (screening) => (

                                        <div
                                            key={screening.id}
                                            className="col-md-4 mb-4"
                                        >

                                            <div className="card h-100">

                                                <div className="card-body">

                                                    <h5 className="card-title">
                                                        {
                                                            screening.movieTitle
                                                        }
                                                    </h5>

                                                    <p className="card-text">

                                                        <strong>
                                                            Cinema:
                                                        </strong>

                                                        {" "}

                                                        {
                                                            screening.cinemaName
                                                        }

                                                    </p>

                                                    <p className="card-text">

                                                        <strong>
                                                            Start Time:
                                                        </strong>

                                                        {" "}

                                                        {
                                                            new Date(
                                                                screening.startTime
                                                            ).toLocaleString()
                                                        }

                                                    </p>

                                                    <div className="d-flex gap-2">

                                                        <Link
                                                            className="btn btn-success btn-sm"
                                                            to={`/screenings/${screening.id}/room`}
                                                        >
                                                            View seats
                                                        </Link>

                                                        {isAdmin() && (

                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        screening.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )
                            )
                    }

                </div>

            </div>
        </>
    );
}