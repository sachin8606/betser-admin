import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getEmergencyServices = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/emergencyService/`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const editEmergencyServices = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/emergencyService/update`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const createEmergencyService = async (data) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/emergencyService/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteEmergencyService = async (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_BASE_URL}/emergencyService/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
