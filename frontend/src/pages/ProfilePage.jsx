import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

export default function ProfilePage() {
    const currentUser = getCurrentUser();

    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchProfile = async () => {
        try {
            const response = await api.get(
                `/users/${currentUser.id}`
            );

            setProfile(response.data);
        }
        catch {
            setError("Failed to load profile.");
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchProfile();
        }
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.put(`/users/${profile.id}`, {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber,
                concurrencyStamp: profile.concurrencyStamp
            });

            await fetchProfile();

            setMessage("Profile updated successfully.");
        }
        catch (err) {
            if (err.response?.status === 409) {
                setError("Concurrency conflict. Please reload and try again.");
                await fetchProfile();
            }
            else {
                setError("Failed to update profile.");
            }
        }
    };

    if (!profile) {
        return (
            <>
                <Navbar />
                <div className="container mt-5">
                    <p>Loading profile...</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container mt-5">
                <h2 className="mb-4">My Profile</h2>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input className="form-control" value={profile.email} disabled />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            name="firstName"
                            className="form-control"
                            value={profile.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            name="lastName"
                            className="form-control"
                            value={profile.lastName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            name="phoneNumber"
                            className="form-control"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
}