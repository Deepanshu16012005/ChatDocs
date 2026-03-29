import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API_URL = process.env.REACT_APP_API_URL;

// Helper to get auth headers
const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// Create a new session
export const createSession = async () => {
    const response = await axios.post(
        `${API_URL}/api/sessions`,
        {},
        authHeaders()
    );
    return response.data;
};

// Get all sessions
export const getSessions = async () => {
    const response = await axios.get(
        `${API_URL}/api/sessions`,
        authHeaders()
    );
    return response.data;
};

// Update session title
export const updateSessionTitle = async (sessionId, title) => {
    const response = await axios.patch(
        `${API_URL}/api/sessions/${sessionId}`,
        { title },
        authHeaders()
    );
    return response.data;
};