import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API_URL = process.env.REACT_APP_API_URL;

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// Send a message and get AI response
export const sendMessage = async (message, sessionId) => {
    const response = await axios.post(
        `${API_URL}/api/chat`,
        {
            message,
            session_id: sessionId
        },
        authHeaders()
    );
    return response.data;
};

// Get chat history for a session
export const getChatHistory = async (sessionId) => {
    const response = await axios.get(
        `${API_URL}/api/chat/${sessionId}`,
        authHeaders()
    );
    return response.data;
};