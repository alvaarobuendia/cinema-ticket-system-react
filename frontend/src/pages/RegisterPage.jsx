import { useState } from "react";

import {
    useNavigate,
    Navigate
} from "react-router-dom";

import api from "../services/api";

export default function RegisterPage() {

    const token =
        localStorage.getItem("token");

    const navigate =
        useNavigate();

    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: ""
        });

    const [error, setError] =
        useState("");

    if (token) {
        return <Navigate to="/" />;
    }

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            await api.post(
                "/auth/register",
                formData
            );

            const loginResponse =
                await api.post(
                    "/auth/login",
                    {
                        email: formData.email,
                        password: formData.password
                    }
                );

            localStorage.setItem(
                "token",
                loginResponse.data.token
            );

            navigate("/");
        }
        catch (err) {

            console.log(
                err.response?.data
            );

            if (
                Array.isArray(
                    err.response?.data
                )
            ) {

                setError(
                    err.response.data
                        .map(
                            (e) =>
                                e.description
                        )
                        .join(" ")
                );
            }
            else {

                setError(
                    "Registration failed"
                );
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">

                    <h2 className="mb-4">
                        Register
                    </h2>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phoneNumber"
                                className="form-control"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                        >
                            Register
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}