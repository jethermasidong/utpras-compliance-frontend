import api from './api.js';


export const createUpdatedDocument = async (application_id, requirement_id, data) => {
    try {
        const response =  await api.post(`/updated-documents/create/${application_id}/${requirement_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};


export const editUpdatedDocumentFileUpload = async (application_id, requirement_id, data) => {
    try {
        const response = await api.put(`/updated-documents/update/${application_id}/${requirement_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
