import { useNavigate } from "@remix-run/react";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold cursor-pointer" onClick={() => navigate("/")}>
          Shopify Remix App
        </h1>

        <nav>
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/addBook")}
            className="mr-4 px-4 py-2 rounded bg-green-500 hover:bg-green-600 transition"
          >
            Add Books
          </button>
          <button
            onClick={() => navigate("/activityLogs")}
            className="mr-4 px-4 py-2 rounded bg-blue-500 hover:bg-green-600 transition"
          >
            Activity Logs
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
