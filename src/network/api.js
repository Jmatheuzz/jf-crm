import axios from "axios"

export const apiBase = axios.create({baseURL: 'http://localhost:8000/api'})

export const apiAuth = axios.create({baseURL: 'http://localhost:8000/api/auth'})

apiBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
      const message ="Ocorreu um erro inesperado. Tente novamente.";
      window.showErrorModal(message);
    return Promise.reject(error);
  }
);

apiBase.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    
    if ([403, 401].includes(error.status)){
      window.location.href = '/login'
    }
    if(error.config.method !== 'get'){
      const message ="Ocorreu um erro inesperado. Tente novamente.";
      window.showErrorModal(message);
    }
    
      
    return Promise.reject(error);
  }
);