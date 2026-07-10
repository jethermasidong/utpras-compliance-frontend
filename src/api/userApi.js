import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data;
        
    } catch (err) {
        throw err.response?.data || err.message;
    }
}