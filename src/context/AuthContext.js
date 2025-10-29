// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    // State to hold the user info and JWT token
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token')); // Load token from storage
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); 
    const [isAdmin, setIsAdmin] = useState(false); 

    // Function to update state and localStorage upon successful login
    const login = (token, user) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        setIsAdmin(user.role === 'Admin');
    };

    // Function to clear state and localStorage upon logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    // Initial check for user role (This is simplified, a full app would decode the JWT here)
    useEffect(() => {
        if (token) {
            // Assume the user details (role) were saved alongside the token in real life
            // For now, we'll just check if the token exists to set isAuthenticated
            setIsAuthenticated(true);
            // We need a more robust way to set user and isAdmin on page load/refresh
            // We'll address this when we build the full Dashboard component.
        }
    }, [token]);


    const contextValue = {
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        // Placeholder for registering and fetching tasks/logs
        apiBaseUrl: 'http://localhost:3000/api', 
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
