import api from '../api/api.js';


export const viewDocuments = async (application_id, program_id) => {

    try {
        const response = await api.get(`/documents/${application_id}/${program_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    } 
}