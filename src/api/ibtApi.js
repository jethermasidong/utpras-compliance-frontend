import api from '../api/api.js';


export const createRequirements = async (data) => {
    try {
        const response = await api.post('/requirements-create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editRequirements = async (data) => { 
    try {
        const response = await api.put('/requirements-update', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewRequirement = async (program_id) => {
    try {
        const response = await api.get(`/requirement/${program_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};