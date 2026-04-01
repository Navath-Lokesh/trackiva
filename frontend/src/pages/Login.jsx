import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000"; // ✅ ADDED


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">

      {/* Card */}
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-lg w-80"
      >

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 transition text-white p-3 rounded-lg font-semibold">
          Login
        </button>

        {/* Register */}
        <p className="text-sm mt-5 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer font-medium hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </form>

    </div>
  );
}