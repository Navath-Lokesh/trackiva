import axios from "axios";
import BASE_URL from "./Main_url";

// const API = "http://localhost:5000/api/progress";
const API = `${BASE_URL}/api/progress`;

export const markHabit = async (data) => {
  const token = localStorage.getItem("token");

  return axios.post(`${API}/mark`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMontlyProgress = async (month, year) => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/month?month=${month}&year=${year}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};