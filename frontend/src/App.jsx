import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path:"/register",
    element: <Register/>
  },
  {
    path:"/dashboard",
    element: <Dashboard/>
  },{
    path:"/habits",
    element: <Habits/>
  }
])

function App(){
  return <RouterProvider router={router}/>
}

export default App
