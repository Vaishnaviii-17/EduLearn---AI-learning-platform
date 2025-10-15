import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 180000,
});

export const uploadFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const postData = async (endpoint, payload) => {
  const res = await apiClient.post(endpoint, payload);
  return res.data;
};

export const fetchData = async (endpoint) => {
  const res = await apiClient.get(endpoint);
  return res.data;
};
