import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getCommunicationUser = async (data) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE_URL}/communication/user/${data.id}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getUsersChatList = async () =>{
    const token = localStorage.getItem("token");
    return axios.get(`${API_BASE_URL}/communication/userListChat`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const uploadFile = async (data) =>{
    const token = localStorage.getItem("token");
    return axios.post(`${API_BASE_URL}/communication/upload`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
