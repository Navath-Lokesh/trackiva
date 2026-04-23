import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false); // ✅ NEW: loading state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ NEW: prevent multiple clicks

    setLoading(true); // ✅ NEW: start loading

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful 🚀");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password ❌");
    } finally {
      setLoading(false); // ✅ NEW: stop loading (important!)
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">

      <form
        onSubmit={handleLogin}
        className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-lg w-80"
      >

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading} // ✅ NEW
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          disabled={loading} // ✅ NEW
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          disabled={loading} // ✅ NEW
          className={`w-full p-3 rounded-lg font-semibold transition flex items-center justify-center ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {loading ? (
            // ✅ NEW: spinner
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* Register */}
        <p className="text-sm mt-5 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer font-medium hover:underline"
            onClick={() => !loading && navigate("/register")} // ✅ NEW
          >
            Register
          </span>
        </p>

      </form>

    </div>
  );
}