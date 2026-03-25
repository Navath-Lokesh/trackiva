import { Link, useNavigate } from "react-router-dom";

// 🔥 SAFE PARSE FUNCTION (prevents crash)
const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export default function Navbar() {

  // 🔴 SAFE user extraction
  const userData = localStorage.getItem("user");
  const user = safeParse(userData);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">

      {/* Logo */}
      <h1 className="text-xl font-bold text-green-500 flex items-center gap-2">
        ✔ Trackiva
      </h1>

      {/* Links */}
      <div className="flex gap-6 text-gray-700 font-medium">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/analytics">Analytics</Link>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3">

        {/* Username */}
        <span className="text-sm font-medium">
          {user?.name || "User"}
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-4 text-red-500 font-medium"
        >
          Logout
        </button>

      </div>

    </div>
  );
}