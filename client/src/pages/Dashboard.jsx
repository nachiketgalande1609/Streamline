import React, { useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    useEffect(() => {
        const res = axios.get("api/dashboard");
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}
