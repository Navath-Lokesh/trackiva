import axios from "axios";

//  const BASE_URL = "http://192.168.29.218:5000/api";

export const getAnalytics = async () =>{
    const token = localStorage.getItem("token");

    return axios.get("http://localhost:5000/api/analytics/dashboard",{
        headers: { Authorization: `Bearer ${token}`}
    });
};

export const getHeatmap = async() =>{
    const token = localStorage.getItem("token");

    return axios.get("http://localhost:5000/api/analytics/heatmap",{
        headers: { Authorization: `Bearer ${token}`}
    });
}