import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DemoAccount from "../components/demoAccount";

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false); // ✅ toggle state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful ");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: "demo@trackiva.com",
        password: "demo123",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Logged in as Demo User 🚀");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error("Demo login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        
        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-gray-800 border border-gray-600 p-8 rounded-2xl shadow-xl shadow-black/30"
        >
          <div className="text-center mb-6">
  <h1 className="text-3xl font-bold text-green-400 mb-1">
    Trackiva
  </h1>
  <p className="text-gray-400 text-sm">
    Build habits. Stay consistent.
  </p>

  <h2 className="text-xl font-semibold text-white mt-4">
    Welcome Back 👋
  </h2>
</div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-gray-800"
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-gray-800"
          />

          <button
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold transition flex items-center justify-center ${
              loading
                ? "bg-blue-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-sm mt-5 text-center text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer font-medium hover:underline"
              onClick={() => !loading && navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>

        {/* ✅ Toggle Button */}
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="mt-4 w-full text-sm text-green-400 hover:underline"
        >
          {showDemo ? "Hide Demo Account" : "🚀 Try Demo Account"}
        </button>

        {/* ✅ Show only when clicked */}
        {/* {showDemo && (
          <DemoAccount onDemoLogin={handleDemoLogin} />
        )} */}

        {/* ✅ Animated Wrapper */}
<div
  className={`overflow-hidden transition-all duration-500 ease-in-out ${
    showDemo ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
  }`}
>
  <DemoAccount onDemoLogin={handleDemoLogin} />
</div>

<div className="mt-6 text-center text-xs text-gray-400">
  <p>
    Can't login or not receiving verification email?
  </p>
  <p>
    Contact support:{" "}
    <span className="text-blue-400">
      trackiva.app@gmail.com
    </span>
  </p>
</div>

      </div>
    </div>
  );
}