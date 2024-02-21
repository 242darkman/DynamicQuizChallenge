'use client';

import { GlobalOutlined, LockOutlined, LogoutOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { Progress, Tooltip } from 'antd';
import React, { useEffect } from 'react';

import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/_context/SocketContext';

const HeaderUI = ({ username, timer, theme, difficulty, isPrivate, roomName }) => {
  const router = useRouter();
  const socket = useSocket();

  const leaveRoom = () => {
    socket.emit('leaveRoom');
  };

  useEffect(() => { 

    if (socket) {
      socket.on('leaveRoomResponse', (response) => {
        router.push('/room');
        toast.success(response.message);
      })
    }

    return () => {
      if (socket) {
        socket.off('leaveRoomResponse');
      }
    }
  }, [socket, router]);

  return (
    <div className="flex justify-around items-center content-center p-4 bg-blue-900 text-white">
      <div>
        <Tooltip title="Pseudo" placement="bottom">
          <h1 className="text-xl font-bold flex items-center">
            <UserOutlined className="mr-2" />{username}
          </h1>
        </Tooltip>
        <div className="flex items-center mt-2">
          <Tooltip title="Thème" placement="bottom">
            <p className="flex items-center mr-2">
              <TagOutlined className="mr-1" />{theme}
            </p>
          </Tooltip>
          <p className="mr-2">|</p>
          <Tooltip title="Difficulté" placement="bottom">
            <p> {difficulty} </p>
          </Tooltip>
          <p className="ml-2 mr-2">|</p>
          <Tooltip title="Nom du Salon" placement="bottom">
            <div className="flex">
              <p className="ml-2"> {isPrivate ? <LockOutlined /> : <GlobalOutlined />} </p>
              <span className="ml-2">{roomName}</span>
            </div>
          </Tooltip>
        </div>
      </div>

      <Tooltip title="Quitter le Salon" placement="bottom">
        <LogoutOutlined onClick={leaveRoom} style={{ fontSize: '24px', cursor: 'pointer', marginLeft: '20px', marginRight: '20px' }} />
      </Tooltip>
      
      <Progress
        className="ml-4"
        type="circle"
        percent={(timer / 30) * 100}
        strokeColor={timer > 10 ? '#52c41a' : '#f5222d'} 
        format={() => {
                  const countDown = 30 - timer;
                  if (countDown <= 0) {
                    return '00:30';
                  }
                  const minutes = Math.floor((30 - timer) / 60);
                  const seconds = Math.round(30 - countDown);
                  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }}
        size={60}
        style={{ color: 'white !important', fontWeight: 'bold' }}
      />
    </div>
  );
};

export default HeaderUI;