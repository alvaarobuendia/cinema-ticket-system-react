import {
    Navigate
} from "react-router-dom";

import {
    getCurrentUser,
    isAdmin
} from "../services/auth";

interface Props {
    children: JSX.Element;
    adminOnly?: boolean;
}

export default function ProtectedRoute({
    children,
    adminOnly = false
}: Props) {

    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (
        adminOnly
        && !isAdmin()
    ) {
        return <Navigate to="/" />;
    }

    return children;
}