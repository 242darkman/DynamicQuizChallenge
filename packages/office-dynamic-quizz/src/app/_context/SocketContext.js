'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { io } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { useAuth } from '@/app/_context/AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authToken } = useAuth();

  useEffect(() => {
    
    const isValidToken = (authToken) => {
      if (!authToken) return false;

      try {
        const decoded = jwt.decode(authToken); 
        
        const isExpired = decoded.exp * 1000 < Date.now();
        return !isExpired;
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        return false;
      }
    };

    if (isValidToken(authToken)) {
      const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
        autoConnect: false,
        withCredentials: true,
        extraHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setSocket(newSocket);

      if (!newSocket.connected) newSocket.connect();

      newSocket.on('error', () => {
        newSocket.emit('socketError');
      });

      newSocket.on('disconnect', () => {
        newSocket.emit('socketError');
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [authToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;