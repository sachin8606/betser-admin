import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchRequests = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/request`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const updateRequest = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_BASE_URL}/request/update/${data.id}`,data.data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}


