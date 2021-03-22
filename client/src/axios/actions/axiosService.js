import axios from 'axios';
import { base } from './baseUrl'

const axiosService = axios.create({
    baseURL: `${base}`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const setAuthToken = instance => {
    const token = localStorage.getItem('token');
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
};

// singleton instance
export default axiosService;