import {
    useEffect,
    useState
} from "react";

import { Navigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../services/api";

import { isAdmin } from "../services/auth";

export default function UsersPage() {

    if (!isAdmin()) {
        return <Navigate to="/" />;
    }

    const [users, setUsers] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const fetchUsers = async () => {

        try {

            const response =
                await api.get("/users");

            setUsers(response.data);
        }
        catch {

            setError(
                "Failed to load users."
            );
        }
    };

    useEffect(() => {

        fetchUsers();

    }, []);

    const handleChange = (
        id,
        field,
        value
    ) => {

        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        [field]: value
                    }
                    : user
            )
        );
    };

    const handleSave = async (
        user
    ) => {

        setMessage("");
        setError("");

        try {

            const response = await api.put(
                `/users/${user.id}`,
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    concurrencyStamp: user.concurrencyStamp
                }
            );

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === user.id
                        ? response.data.user
                        : u
                )
            );

            setMessage(
                `User ${user.email} updated successfully.`
            );
        }
        catch (err) {

            if (
                err.response?.status === 409
            ) {

                setError(
                    `Concurrency conflict while updating ${user.email}. Reloading data.`
                );

                await fetchUsers();
            }
            else {

                setError(
                    "Failed to update user."
                );
            }
        }
    };

    const handleDelete = async (
        user
    ) => {

        const confirmed =
            window.confirm(
                `Delete ${user.email}?`
            );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await api.delete(
                `/users/${user.id}?concurrencyStamp=${user.concurrencyStamp}`
            );

            await fetchUsers();

            setMessage(
                `User ${user.email} deleted successfully.`
            );
        }
        catch (err) {

            if (
                err.response?.status === 409
            ) {

                setError(
                    `Concurrency conflict while deleting ${user.email}.`
                );

                await fetchUsers();
            }
            else {

                setError(
                    "Failed to delete user."
                );
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-5">

                <h2 className="mb-4">
                    Users Management
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

                <div className="table-responsive">

                    <table className="table table-bordered">

                        <thead>

                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {users.map((user) => (

                                <tr key={user.id}>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>

                                        <input
                                            className="form-control"
                                            value={user.firstName}
                                            onChange={(e) =>
                                                handleChange(
                                                    user.id,
                                                    "firstName",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </td>

                                    <td>

                                        <input
                                            className="form-control"
                                            value={user.lastName}
                                            onChange={(e) =>
                                                handleChange(
                                                    user.id,
                                                    "lastName",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </td>

                                    <td>

                                        <input
                                            className="form-control"
                                            value={user.phoneNumber}
                                            onChange={(e) =>
                                                handleChange(
                                                    user.id,
                                                    "phoneNumber",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </td>

                                    <td>

                                        <button
                                            className="
                                                btn
                                                btn-primary
                                                btn-sm
                                                me-2
                                            "
                                            onClick={() =>
                                                handleSave(user)
                                            }
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="
                                                btn
                                                btn-danger
                                                btn-sm
                                            "
                                            onClick={() =>
                                                handleDelete(user)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}