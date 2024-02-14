"use client";

import { Dropdown, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { toast } from "sonner";
import withAuth from "@/app/middleware";

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModale, setTitleModale] = useState("");
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

    // Écouteurs pour les réponses du serveur
    newSocket.on('roomCreated', (room) => {
      console.log('Room created successfully', room);
      toast.success("Salle créée avec succès !");
      // Mettez à jour l'état ici si nécessaire
    });

    newSocket.on('joinedRoom', (room) => {
      console.log(`Joined room successfully`, room);
      toast.success(`Bienvenue dans la salle ${room.name} !`);
      // Mettez à jour l'état ici si nécessaire
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

  const handleChangePrivate = () => {
    setTitleModale("Salle privée");
    setIsModalOpen(true);
  };

  const items = [
    {
      key: "1",
      label: <a onClick={handleChangePrivate}>Privée</a>,
    },
    {
      key: "2",
      label: <a onClick={() => createPublicRoom()}>Publique</a>,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * création d'un salon public
   */
  const createPublicRoom = () => {
    if (!name) {
      toast.error("Veuillez indiquer le nom de la salle.");
      return;
    }

    socket.emit("createRoom", {
      name,
      isPrivate: false,
    });

    setRoomName("");
  };

  /**
   * création d'un salon privé
   * @param {*} event
   * @returns
   */
  const handleCreatePrivateRoom = async (event) => {
    event.preventDefault();
    if (!name || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    socket.emit("createRoom", {
      name,
      isPrivate: true,
      password,
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
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomLeft"
          arrow
        >
          <a
            className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor w-full"
            style={{ whiteSpace: "nowrap" }}
          >
            Créer un salon
          </a>
        </Dropdown>
        <a
          href="/waiting-room"
          className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor w-full"
          style={{ whiteSpace: "nowrap" }}
        >
          Rejoindre un salon
        </a>
      </div>

      <Modal
        title={titleModale}
        open={isModalOpen}
        okText="Valider"
        okButtonProps={{ className: "bg-blue-500" }}
        onOk={handleCreatePrivateRoom}
        onCancel={handleCancel}
      >
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Nom du salon"
            value={name}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Input
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default withAuth(Room);
