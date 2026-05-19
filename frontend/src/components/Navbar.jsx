import { Link, useNavigate } from "react-router-dom";

import {
    getCurrentUser,
    isAdmin,
    logout
} from "../services/auth";

export default function Navbar() {
    const navigate = useNavigate();

    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    🎬 Cinema System
                </Link>

                <div className="navbar-nav me-auto">
                    <Link className="nav-link" to="/screenings">
                        Screenings
                    </Link>

                    {user && (
                        <Link className="nav-link" to="/profile">
                            Profile
                        </Link>
                    )}

                    {user && isAdmin() && (
                        <Link className="nav-link" to="/users">
                            Users
                        </Link>
                    )}
                </div>

                <div className="d-flex align-items-center">
                    {user ? (
                        <>
                            <span className="text-light me-3">
                                {user.email} ({user.role})
                            </span>

                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                className="btn btn-outline-light btn-sm me-2"
                                to="/login"
                            >
                                Login
                            </Link>

                            <Link
                                className="btn btn-success btn-sm"
                                to="/register"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}