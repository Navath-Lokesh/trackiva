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

export const deleteHabit = async () =>{
  const token =localStorage.getItem("token");

  return axios.delete(`http://localhost:5000/api/habits${id}`,{
    headers: { Authorization: `Bearer ${token}`}
  });
};