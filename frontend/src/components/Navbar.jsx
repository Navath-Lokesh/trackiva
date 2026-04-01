import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

// ✅ SAFE PARSE
const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export default function Navbar() {

  const userData = localStorage.getItem("user");
  const user = safeParse(userData);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700 shadow-md">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Trackiva Logo" className="w-16 h-10" />
        <h1 className="text-xl font-bold text-green-400">
          Trackiva
        </h1>
      </div>

      {/* Links */}
      <div className="flex gap-6 font-medium">

        <Link
          to="/dashboard"
          className={`transition ${
            isActive("/dashboard")
              ? "text-green-400 border-b-2 border-green-400 pb-1"
              : "text-gray-300 hover:text-green-400"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/habits"
          className={`transition ${
            isActive("/habits")
              ? "text-green-400 border-b-2 border-green-400 pb-1"
              : "text-gray-300 hover:text-green-400"
          }`}
        >
          Habits
        </Link>

        <Link
          to="/analytics"
          className={`transition ${
            isActive("/analytics")
              ? "text-green-400 border-b-2 border-green-400 pb-1"
              : "text-gray-300 hover:text-green-400"
          }`}
        >
          Analytics
        </Link>

      </div>

      {/* User Section */}
      <div className="flex items-center gap-3">

        <span className="text-sm font-medium text-gray-300">
          {user?.name || "User"}
        </span>

        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}