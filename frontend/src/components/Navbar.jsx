import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";


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

  // share feature

   const handleShare = async () => {
    const shareData = {
      title: "Trackiva",
      text: "Track your habits with Trackiva 🚀",
      url: "https://trackiva-phi.vercel.app/",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard 🚀");
      }
    } catch (err) {
      console.log("Share error:", err);
    }
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

         {/* SHARE FEATURE ADDED */}
           <button
  onClick={handleShare}
  title="Share Trackiva"
  className="
  border border-indigo-400/30
  bg-indigo-500/10
  hover:bg-indigo-500/20
  text-indigo-200
  w-11 h-11
  rounded-xl
  flex items-center justify-center
  transition-all duration-200
  hover:scale-105 active:scale-95
  backdrop-blur-md
  shadow-lg shadow-indigo-500/10
  "
>
  {/* YouTube-style Share Icon */}
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 2.2-8.8 5.48 1.05-5.19 4.66-9.48 9.8-9.48h0V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z" />
  </svg>
</button>

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