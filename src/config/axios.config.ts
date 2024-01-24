import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://threetared-fullstack-todo-app.onrender.com/api',
  timeout: 1000,
});

export default axiosInstance;
