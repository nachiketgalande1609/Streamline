import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // import dependency

export default function Home() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      setName(user.name);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, []);

  return (
    <div>
      <h1>Welcome {name}</h1>
    </div>
  );
}
