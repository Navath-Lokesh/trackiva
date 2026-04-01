import axios from "axios";
import BASE_URL from "./Main_url"; // ✅ correct path + case

// ✅ FIXED BASE URL
const API = `${BASE_URL}/api/habits`;

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

// ✅ DELETE HABIT
export const deleteHabit = async (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};