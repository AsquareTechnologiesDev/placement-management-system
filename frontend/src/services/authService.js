// src/services/authService.js

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api";

const authService = {
    login: async (email, password) => {
        const response = await fetch(
            `${API_BASE_URL}/auth/login/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Login failed"
            );
        }

        return data;
    },

    getCurrentUser: async () => {
        const token = localStorage.getItem(
            "access_token"
        );

        const response = await fetch(
            `${API_BASE_URL}/auth/me/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Failed to fetch current user"
            );
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem("access_token");
    },

    getAccessToken: () => {
        return localStorage.getItem(
            "access_token"
        );
    },
};

export default authService;