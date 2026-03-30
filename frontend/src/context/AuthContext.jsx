import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveToken, removeToken, getToken, isAuthenticated, getUserId } from '../utils/tokenUtils';
import { loginUser, registerUser } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            const token = getToken();
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ userId: payload.userId });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        saveToken(data.token);
        setUser({
            userId: data.user.id,
            name: data.user.name,
            email: data.user.email
        });
        return data;
    };

    // Register function
    const register = async (name, email, password) => {
        const data = await registerUser(name, email, password);
        return data;
    };

    // Logout function
    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isLoggedIn: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;