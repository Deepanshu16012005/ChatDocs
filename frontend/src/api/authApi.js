import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Register a new user
export const registerUser = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
    });
    return response.data;
};

// Login user
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
    });
    return response.data;
};