"use client";

import { Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRoom } from '@/app/_context/RoomContext';
import { useRouter } from "next/navigation";
import { useSocket } from '@/app/_context/SocketContext';
import withAuth from "@/app/middleware";

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { storeRoomData } = useRoom();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleJoinRoom = (room) => {
      toast.success(`Bienvenue dans le salon "${room.name}" ! Attachez votre ceinture, l'aventure commence !`);
    };

    const handleError = (error) => {
      console.error("Error from server:", error);
      toast.error("Un petit souci... le serveur fait des siennes !");
    };

    socket.on('joinedRoom', handleJoinRoom);
    socket.on('error', handleError);

    return () => {
      if (socket) {
        socket.off('joinedRoom', handleJoinRoom);
        socket.off('error', handleError);
      }
    };
  }, [socket]);


  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAction = async () => {
    if (!name || (isPrivate && !password)) {
      toast.error("Il nous faut un peu plus d'info pour lancer cette fusée !");
      return;
    }

    const actionType = modalType === "create" ? "createRoom" : "joinRoom";
    
    if (socket) {
      socket.emit(actionType, {
        name,
        isPrivate,
        ...(isPrivate && { password }),
      });
    }

    storeRoomData({
      name,
      isPrivate,
      password: isPrivate ? password : undefined,
    });

    setIsModalOpen(false);

    router.push("/room/settings");

    toast.info(`Destination : paramètres du salon "${name}". Préparez votre équipement !`);
  };

  return (
    <div className="min-h-screen p-24 bg-mainColor flex items-center justify-center flex-col">
      <div>
        <h1 className="text-5xl">Que souhaitez-vous faire ?</h1>
      </div>
      <div className="flex items-center justify-center gap-10 m-10">
        <button
          onClick={() => handleOpenModal("create")}
          className="px-7 py-4 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor"
        >
          Créer un salon
        </button>
        <button
          onClick={() => handleOpenModal("join")}
          className="px-7 py-4 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor"
        >
          Rejoindre un salon
        </button>
      </div>

      <Modal
        title={`${modalType === "create" ? "Créer" : "Rejoindre"} un salon`}
        open={isModalOpen}
        onOk={handleAction}
        okButtonProps={{ className: "bg-mainColor text-white hover:bg-violet-400" }}
        onCancel={() => setIsModalOpen(false)}
        okText="C'est parti !"
        cancelText="Annuler"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Radio.Group
            onChange={(e) => setIsPrivate(e.target.value)}
            value={isPrivate}
            className="mb-4 flex justify-around"
          >
            <Radio value={false}>Public</Radio>
            <Radio value={true}>Privé</Radio>
          </Radio.Group>
          <Input
            placeholder="Nom du salon"
            value={name}
            onChange={(e) => setRoomName(e.target.value)}
            className="mb-4"
          />
          {isPrivate && (
            <Input
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </motion.div>
      </Modal>
    </div>
  );
}

export default withAuth(Room);