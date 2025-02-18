import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchNotifications = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/notification/getNotifications`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const updateNotification = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_BASE_URL}/notification/${data.id}`,data.data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}


