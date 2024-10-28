// UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // import dependency
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const verifyToken = async () => {
        if (location.pathname !== "/login" && location.pathname !== "/register") {
            if (token) {
                try {
                    const response = await axios.get("/api/verify-token", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data.success) {
                        const decodedUser = jwtDecode(token);
                        setUser(decodedUser);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Token verification failed", error);
                    logout();
                }
            } else {
                logout();
            }
        }
    };

    useEffect(() => {
        verifyToken();
    }, [token, location.pathname]);

    const updateUser = (newUser) => {
        setUser(newUser);
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
        axios.defaults.headers.common = {};
        navigate("/login");
    };

    return <UserContext.Provider value={{ user, updateUser, logout }}>{children}</UserContext.Provider>;
};
