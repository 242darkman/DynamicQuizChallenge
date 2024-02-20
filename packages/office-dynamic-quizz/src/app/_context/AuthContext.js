'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('app_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {

    if (authToken) {
      try {
        const decoded = jwt.decode(authToken);
        setUser(decoded.user);
      } catch (error) {
        localStorage.removeItem("app_token");
        setUser(null);
        setAuthToken(null);
        console.error("Erreur lors du décodage du token:", authToken);
      }
    }
  }, [authToken]);
  
  const login = (token) => {
    localStorage.setItem('app_token', token);
    const decoded = jwt.decode(token);
    setUser(decoded.user);
    setAuthToken(token);
    router.push('/room');
  };


  const logout = (path) => {
    localStorage.removeItem("app_token");
    setUser(null);
    setAuthToken(null);
    router.push(path);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
