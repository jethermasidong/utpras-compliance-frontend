import api from '../api/api.js';


export const createEBETProfile = async (data) => {
    try {
        const response = await api.post('/ebet-profile/create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editEBETProfile = async (application_id, data) => {
    try {
        const response = await api.put(`/ebet-profile/edit/${application_id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewEBETProfileByApplicationID = async (application_id) => {
    try {
        const response = await api.get(`/ebet-profile/${application_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewEBETProfileByUserID = async () => {
    try {
        const response = await api.get('/ebet-profile');
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
