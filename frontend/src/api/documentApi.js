import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API_URL = process.env.REACT_APP_API_URL;

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
        `${API_URL}/api/documents/upload`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
};

export const getDocuments = async () => {
    const response = await axios.get(
        `${API_URL}/api/documents`,
        authHeaders()
    );
    return response.data;
};