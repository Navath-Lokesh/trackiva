import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Verify from "./pages/Verify"; // ✅ FIXED (capital V)

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/verify", // ✅ must be lowercase
    element: <Verify /> // ✅ FIXED
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/habits",
    element: (
      <ProtectedRoute>
        <Layout>
          <Habits />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <Layout>
          <Analytics />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <Layout>
          <Chat />
        </Layout>
      </ProtectedRoute>
    )
  }
]);

function App() {
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Router */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;