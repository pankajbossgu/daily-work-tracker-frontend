// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isAdmin, setIsAdmin] = useState(user?.role === "admin");

  // 🔹 Function: login user
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === "admin");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 🔹 Function: logout user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  // 🔹 Keep user state synced with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export the useAuth hook so other components can access the context
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };
