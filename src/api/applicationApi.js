import api from "../api/api.js";


export const createApplication = async (data) => {
    try {
        const response = await api.post('/applications-create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editApplications = async (data) => {
    try {
        const response = await api.put('/applications-update', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewApplicationsByUser = async () => {
    try {
        const response = await api.get('/application');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
}