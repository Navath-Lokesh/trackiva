import axios from "axios";

const API = "http://localhost:5000/api/habits";

export const createHabit = async (data) => {
  const token = localStorage.getItem("token");

  return axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getHabits = async () => {
  const token = localStorage.getItem("token");

  return axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 🔥 FIXED
export const deleteHabit = async (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};