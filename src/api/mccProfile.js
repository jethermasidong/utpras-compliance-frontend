import api from '../api/api.js';


export const createMCCProfile = async (data) => {
    try {
        const response = await api.post('/mcc-profile/create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editMCCProfile = async (application_id, data) => {
    try {
        const response = await api.put(`/mcc-profile/edit/${application_id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewMCCProfileByApplicationID = async (application_id) => {
    try {
        const response = await api.get(`/mcc-profile/${application_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewMCCProfileByUserID = async () => {
    try {
        const response = await api.get('/mcc-profile');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
