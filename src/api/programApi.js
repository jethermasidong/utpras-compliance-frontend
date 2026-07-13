import api from '../api/api.js';


export const createProgram = async (data) => {
    try {
        const response = await api.post('/programs-create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};


export const editProgram = async (data) => {
    try {
        const response = await api.put('/programs-update', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewPrograms = async () => {
    try {
        const response = await api.get('/programs');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

