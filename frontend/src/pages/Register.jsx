import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../api/Main_url";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: ""
  });

  const [loading, setLoading] = useState(false); // ✅ NEW

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ NEW: prevent multiple clicks

    setLoading(true); // ✅ NEW: start loading

    try {
      const formattedData = {
        ...form,
        dateOfBirth: form.dateOfBirth
      };

      console.log("Sending Data:", formattedData);

      await axios.post(`${API}/api/auth/register`, formattedData);

      toast.success("Verification done, Try to Login");

      setForm({
        name: "",
        email: "",
        password: "",
        dateOfBirth: ""
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.log(err.response || err);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Registration failed ❌"
      );
    } finally {
      setLoading(false); // ✅ NEW: stop loading
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">

      <form
        onSubmit={handleRegister}
        className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-lg w-80"
      >

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account 🚀
        </h2>

        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={loading} // ✅ NEW
          className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading} // ✅ NEW
          className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading} // ✅ NEW
          className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Button */}
        <button
          disabled={loading} // ✅ NEW
          className={`w-full p-3 rounded-lg font-semibold transition flex items-center justify-center ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {loading ? (
            // ✅ NEW spinner
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Registering...
            </div>
          ) : (
            "Register"
          )}
        </button>

        {/* Login redirect */}
        <p className="text-sm mt-5 text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-green-400 cursor-pointer font-medium hover:underline"
            onClick={() => !loading && navigate("/")} // ✅ NEW
          >
            Login
          </span>
        </p>

      </form>

    </div>
  );
}