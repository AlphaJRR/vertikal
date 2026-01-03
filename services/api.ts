// Demo mode - API disabled
import axios from 'axios';

const api = axios.create({
  baseURL: '',
  timeout: 10000,
});

export default api;
