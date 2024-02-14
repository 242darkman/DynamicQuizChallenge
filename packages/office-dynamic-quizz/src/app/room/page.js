"use client";

import { Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import withAuth from "@/app/middleware";

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);
  const router = useRouter();

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

    newSocket.on('roomCreated', (room) => {
      toast.success(`Le salon "${room.name}" a été créé ! Préparez-vous à vivre des moments épiques !`);
      router.push('/room/settings');
    });

    newSocket.on('joinedRoom', (room) => {
      toast.success(`Bienvenue dans le salon "${room.name}" ! Attachez votre ceinture, l'aventure commence !`);
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
  }, [router]);

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

    actionType === "createRoom" ? toast.success(`Salon en cours de création...`) : toast.success(`Attendez on dresse un tapis rouge pour que vous rejoignez le salon ${name}...`);

    const waitingMessage = actionType === "createRoom" ? 
    `Création du salon "${name}" en cours... Préparez-vous à devenir légendaire !` : 
    `Tentative de rejoindre le salon "${name}"... Espérons que le tapis rouge soit déroulé !`;

    toast.info(waitingMessage);

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