import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginAdmin = async (credentials) => {
  return axios.post(`${API_BASE_URL}/admin/login`, credentials);
};

export const registerAdmin = async (data) => {
  return axios.post(`${API_BASE_URL}/admin/register`, data);
};

export const getAdminDetails = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/admin/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUser = async (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_BASE_URL}/admin/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const exportUsersData = async (filter) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE_URL}/admin/export-users`, filter, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getHelpRequests = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/admin/help-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const acknowledgeHelpRequest = async (requestId) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE_URL}/admin/acknowledge-help`, { requestId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
