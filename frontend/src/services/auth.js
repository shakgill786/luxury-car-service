import { getCurrentUser, loginUser, signupUser } from './api';

export const checkUserAuthentication = async () => {
    try {
        const user = await getCurrentUser();
        return user;
    } catch (error) {
        return null;
    }
};

export const handleLogin = async (credentials) => {
    try {
        const user = await loginUser(credentials);
        return user;
    } catch (error) {
        throw error;
    }
};

export const handleSignup = async (userData) => {
    try {
        const user = await signupUser(userData);
        return user;
    } catch (error) {
        throw error;
    }
};
