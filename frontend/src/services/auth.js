export function getToken() {
    return localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
}

export function getCurrentUser() {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        return {
            id:
                payload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ],

            email:
                payload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ],

            role:
                payload[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ]
        };
    }
    catch {
        return null;
    }
}

export function isAdmin() {
    return getCurrentUser()?.role === "Admin";
}