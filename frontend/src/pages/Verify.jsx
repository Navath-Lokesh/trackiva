import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Verify() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Email verified successfully ✅ Please login");

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-400 mb-4">
          ✅ Email Verified
        </h1>

        <p className="text-gray-300 mb-2">
          Your account has been successfully verified.
        </p>

        <p className="text-gray-400 text-sm mb-4">
          Redirecting to login...
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}