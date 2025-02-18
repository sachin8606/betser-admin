import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchCategory = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/category/getCategories/`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const addCategory = async (data = {}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/category/`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getCategoryById = async (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

};

export const deleteCategory = async (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_BASE_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
