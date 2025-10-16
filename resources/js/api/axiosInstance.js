import axios from 'axios';
import API from '../config/config';

// Crear instancia base
const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    // 'Content-Type': 'application/json', // axios detecta el content-type automaticamente, mejor no enviarlo
    'Accept': 'application/json',
  },
});

// Interceptor de REQUEST - Agregar token a cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_user');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es 401 (token inválido/expirado)
    if (error.response?.status === 401) {
      console.error('Token inválido o expirado');
      localStorage.clear();
      window.location.href = '/login';
    }
    
    // Si es 403 (sin permisos)
    if (error.response?.status === 403) {
      console.error('No tienes permisos para esta acción');
    }
    
    // Si es 500 (error del servidor)
    if (error.response?.status === 500) {
      console.error('Error del servidor');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;