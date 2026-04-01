import axios from "axios";

const API = "http://localhost:5000/api/progress";

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