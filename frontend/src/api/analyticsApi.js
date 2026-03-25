import axios from "axios";

export const getAnalytics = async () =>{
    const token = localStorage.getItem("token");

    return axios.get("http://localhost:5000/api/analytics/dashboard",{
        headers: { Authorization: `Bearer ${token}`}
    });
};