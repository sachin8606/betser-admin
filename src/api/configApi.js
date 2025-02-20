import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchSettings = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const createSettingsApi = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/settings/create`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const updateSettingsApi = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_BASE_URL}/settings/update/${data.id}`,data.data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}


