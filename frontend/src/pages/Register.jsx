import { useState } from "react";
import axios from "axios";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await axios.post("http://localhost:5000/api/auth/register", form);

      alert("Check your email for verification");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-80">

        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input name="name" placeholder="Name" className="w-full p-2 mb-2 border" onChange={handleChange}/>
        <input name="email" placeholder="Email" className="w-full p-2 mb-2 border" onChange={handleChange}/>
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-2 border" onChange={handleChange}/>
        <input name="dateOfBirth" type="date" className="w-full p-2 mb-2 border" onChange={handleChange}/>

        <button className="w-full bg-green-500 text-white p-2 rounded">
          Register
        </button>

      </form>
    </div>
  );
}