import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Verify() {

  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Email verified successfully ✅ Please login");

    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-semibold">
        Verifying your email...
      </h1>
    </div>
  );
}