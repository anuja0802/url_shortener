import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export const createUrl = (data) => api.post('/urls', data);
export const getAllUrls = ()     => api.get('/urls');
export const deleteUrl = (id)   => api.delete(`/urls/${id}`);
