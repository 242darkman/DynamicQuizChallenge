"use client";

import { Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import withAuth from "@/app/middleware";

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "create" ou "join"
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("app_token");
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      autoConnect: false,
      withCredentials: true,
      extraHeaders: {
        authorization: token,
      },
    });
    setSocket(newSocket);

    if (!newSocket.connected) newSocket.connect();

    newSocket.on("connect", () => {
      console.log("Connected to server", newSocket);
    });

    newSocket.on('roomCreated', (room) => {
      console.log('Room created successfully', room);
      toast.success("Salon créée avec succès !");
    });

    newSocket.on('joinedRoom', (room) => {
      console.log(`Joined room successfully`, room);
      toast.success(`Bienvenue dans le salon ${room.name} !`);
    });

    newSocket.on('error', (error) => {
      console.error('Error from server', error);
      toast.error("Erreur lors de l'opération !");
    });

    return () => {
      newSocket.off('connect');
      newSocket.off('roomCreated');
      newSocket.off('joinedRoom');
      newSocket.off('error');
      newSocket.disconnect();
    };
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAction = async () => {
    if (!name || (isPrivate && !password)) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    const actionType = modalType === "create" ? "createRoom" : "joinRoom";
    socket.emit(actionType, {
      name,
      isPrivate,
      ...(isPrivate && { password }),
    });

    setRoomName("");
    setPassword("");
    setIsModalOpen(false);
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
        okText="Valider"
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
            className="mb-4"
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