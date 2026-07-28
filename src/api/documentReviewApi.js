import api from "./api.js";


export const createDocumentReview = async (document_id, data) => {
    try {
        const response = await api.post(`/document-review/create/${document_id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

export const updateDocumentReview = async (document_id, data) => {
    try {
        const response = await api.put(`/document-review/update/${document_id}`, data);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

