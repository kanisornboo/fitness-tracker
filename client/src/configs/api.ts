import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL
});

const token = localStorage.getItem('token');
if (token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
