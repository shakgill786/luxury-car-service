import axios from 'axios';

const api = axios.create({
    baseURL: '/api', 
    withCredentials: true,
});

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/session');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/session', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signupUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllSpots = async () => {
    try {
        const response = await api.get('/spots');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add other functions for handling Spots, Reviews, Bookings, etc.

export default api;
