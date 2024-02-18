'use client';

import React, { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export const useRoom = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {
  const [roomData, setRoomData] = useState(null);
  const [roomSettings, setRoomSettings] = useState(null);
  const [room, setRooms] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);

  const storeRoomData = (data) => {
    setRoomData(data);
  };

  const storeRoomSettings = (settings) => {
    setRoomSettings(settings);
  };

  const storeRoomUsers = (users) => {
    setRoomUsers(users);
  };

  const clearRoomData = () => {
    setRoomData(null);
    setRoomSettings(null);
  };

  return (
    <RoomContext.Provider value={{ roomData, roomSettings, storeRoomData, storeRoomSettings, clearRoomData, room, setRooms, roomUsers, storeRoomUsers }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;