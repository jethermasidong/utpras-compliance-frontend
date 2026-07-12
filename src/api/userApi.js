import api from '../api/api.js';


export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
        
    } catch (err) {
        throw err.response?.data || err.message;
    }
};


export const viewUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};


export const addUser = async(data) => {
    try {
        const response = await api.post('/signup', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message
    }
};