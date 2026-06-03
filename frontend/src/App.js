import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ScreeningsPage from "./pages/ScreeningsPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import RoomPage from "./pages/RoomPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/screenings" element={<ScreeningsPage />} />

            <Route path="/screenings/:screeningId/room" element={<RoomPage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/users" element={<UsersPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}