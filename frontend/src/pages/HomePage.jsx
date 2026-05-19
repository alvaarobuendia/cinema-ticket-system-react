import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getCurrentUser
} from "../services/auth";

export default function HomePage() {
    const user = getCurrentUser();

    if (!user) {
        return (
            <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <h1 className="mb-4">
                    🎬 Cinema Ticket System
                </h1>

                <p className="mb-4">
                    Welcome to the cinema management system
                </p>

                <div>
                    <Link to="/login" className="btn btn-primary me-3">
                        Login
                    </Link>

                    <Link to="/register" className="btn btn-success">
                        Register
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">
                <h1 className="mb-3">
                    🎬 Cinema Ticket System
                </h1>

                <p className="mb-4">
                    Welcome to the cinema management system
                </p>
            </div>
        </>
    );
}