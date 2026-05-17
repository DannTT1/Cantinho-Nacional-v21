import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.15.16:8080',
});

api.interceptors.request.use(
  async (config) => {
    const userData = await AsyncStorage.getItem('@user');
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // token da aplicação
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;