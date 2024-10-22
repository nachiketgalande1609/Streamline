// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // import dependency
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);

                localStorage.setItem("userId", decodedUser.id);
                localStorage.setItem("userEmail", decodedUser.email);
                localStorage.setItem("userName", decodedUser.first_name + " " + decodedUser.last_name);
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    }, [navigate]);

    const updateUser = (newUser) => {
        const token = jwtEncode(newUser);
        setUser(newUser);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    };

    return <UserContext.Provider value={{ user, updateUser, logout }}>{children}</UserContext.Provider>;
};
