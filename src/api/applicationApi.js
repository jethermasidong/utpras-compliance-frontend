import api from "../api/api.js";


export const createApplication = async (data) => {
    try {
        const response = await api.post('/applications-create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editApplications = async (id, data) => {
    try {
        const response = await api.put(`/applications-update/${id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editROApplicationByProgID = async (id, program_id, data) => {
    try {
        const response = await api.put(`/ro-applications/update/${program_id}/${id}`, data);
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
};

export const viewApplicationByUser = async (id) => {
    try {
        const response = await api.get(`/application/${id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewAllApplications = async (id) => {
    try {
        const response = await api.get('/applications');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewApplicationByID = async (id) => {
    try {
        const response = await api.get(`/ro-application/${id}`);
        return response.data; 
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const deleteApplication = async (id) => {
    try {
        const response = await api.delete(`/applications-delete/${id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};