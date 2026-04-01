import axios from "axios";
import API from "./Main_url";

export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/api/analytics/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getHeatmap = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/api/analytics/heatmap`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};