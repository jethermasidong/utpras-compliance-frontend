import api from '../api/api.js';


export const createMTPProfile = async (data) => {
    try {
        const response = await api.post('/mtp-profile/create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editMTPProfile = async (application_id, data) => {
    try {
        const response = await api.put(`/mtp-profile/edit/${application_id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewMTPProfileByApplicationID = async (application_id) => {
    try {
        const response = await api.get(`/mtp-profile/${application_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewMTPProfileByUserID = async () => {
    try {
        const response = await api.get('/mtp-profile');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
