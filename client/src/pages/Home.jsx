import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../context/UserContext";

export default function Home() {
    const { user, updateUser } = useContext(UserContext);

    return (
        <div>
            <h1>Welcome {user ? user.name : "Guest"}</h1>
        </div>
    );
}
