import axios from "axios";

const API = "http://localhost:5000/api/analytics";

export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getHeatmap = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/heatmap`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};