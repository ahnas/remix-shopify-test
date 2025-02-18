import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
    } else {
      setMessage("Welcome to the dashboard!");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">{message}</h1>
      <button
        className="mt-4 text-red-500 underline"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
