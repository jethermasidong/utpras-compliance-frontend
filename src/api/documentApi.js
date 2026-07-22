import api from '../api/api.js';


export const createDocument = async (application_id, requirement_id, data) => {
    try {
        const response =  await api.post(`/documents/create/${application_id}/${requirement_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};


export const editDocumentFileUpload = async (application_id, requirement_id, data) => {
    try {
        const response = await api.put(`/documents/update/${application_id}/${requirement_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
}



export const viewDocuments = async (application_id, program_id) => {

    try {
        const response = await api.get(`/documents/${application_id}/${program_id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    } 
};
