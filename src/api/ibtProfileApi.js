import api from '../api/api.js';


export const createIBTProfile = async (data) => {
    try {
        const response = await api.post('/ibt-profile/create', data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const editIBTProfile = async (data) => {
    try {
        const response = await api.put(`/ibt-profile/edit/${id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const viewIBTProfileByApplicationID = async (application_id) => {
    try {
        const response = await api.get(`/ibt-profile/${application_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
