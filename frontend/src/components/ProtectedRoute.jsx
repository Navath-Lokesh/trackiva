import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const location = useLocation();

  // ❌ No token → redirect
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ✅ Token exists → allow
  return children;
}