'use client';

import React, { createContext, useEffect, useState } from "react";

import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("app_token");

    if (token) {
      try {
        const decoded = jwt.decode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("app_token");
    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
