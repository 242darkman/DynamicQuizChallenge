"use client";

import { Input, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Dropdown, Modal, Input } from "antd";
import { io } from "socket.io-client";
import withAuth from "@/app/middleware";
import { toast } from "sonner";
import CreateRoomModal from "../components/ModalComponent";
=======
>>>>>>> main

import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRoom } from '@/app/_context/RoomContext';
import { useRouter } from "next/navigation";
import { useSocket } from '@/app/_context/SocketContext';
import withAuth from "@/app/middleware";

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD
  const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
  const [titleModale, setTitleModale] = useState("");
  // const [name, setRoomName] = useState("");
  // const [password, setPassword] = useState("");
=======
  const [modalType, setModalType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { storeRoomData, storeRoomUsers } = useRoom();
  const socket = useSocket();
>>>>>>> main

  useEffect(() => {
    if (!socket) return;

    const handleJoinRoom = (room) => {
      toast.success(`Bienvenue dans le salon "${room.name}" ! Attachez votre ceinture, l'aventure commence bientôt !`);
    };

    const handleError = (error) => {
      console.error("Error from server:", error);
      toast.error("Un petit souci... le serveur fait des siennes !");
    };

    socket.on('joinedRoom', handleJoinRoom);

    socket.on('updateRoomUsers', (room) => {
      storeRoomUsers(room.users);

      toast.success('Enfilez votre plus beau pyjama et préparez le popcorn, vous êtes en salle d\'attente ! On vous fait entrer dès qu\'une place se libère sur le canapé virtuel. 🛋️🍿');

      router.push('/room/waiting-room');
    });

    socket.on('error', handleError);

    return () => {
      if (socket) {
        socket.off('joinedRoom', handleJoinRoom);
        socket.off('updateRoomUsers');
        socket.off('error', handleError);
      }
    };
  }, [socket, router, storeRoomUsers]);

<<<<<<< HEAD
  const handleCreatePrivate = () => {
    setTitleModale("Salle privée");
    setIsModalOpen(true);
  };

  const handleCreatePublic = () => {
    setTitleModale("Salle publique");
    setIsModalOpenTwo(true);
  };

  // const items = [
  //   {
  //     key: "1",
  //     label: <a onClick={handleChangePrivate}>Privée</a>,
  //   },
  //   {
  //     key: "2",
  //     label: <a onClick={handleChangePublic}>Publique</a>,
  //   },
  // ];

  //Pour créer une salle
  const itemsCreate = [
    {
      key: "1",
      label: <a onClick={handleCreatePrivate}>Privée</a>,
    },
    {
      key: "2",
      label: <a onClick={handleCreatePublic}>Publique</a>,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelTwo = () => {
    setIsModalOpenTwo(false);
  };

  /**
   * Méthode pour créer une salle
   * @param {*} event
   * @returns
   */
  const handleCreateRoom = ({ name, password }) => {
    //console.log("data est ", data);
    console.log("Création de la salle : ", name);
    // if (isPrivate) {
    //   console.log("Mot de passe : ", password);
    // }
    // event.preventDefault();
    // if (!name || !password) {
    //   toast.error(
    //     "Oups, il semblerait que vous ayez oublié de remplir un champ (ou deux). Merci de les compléter !"
    //   );
    //   return;
    // }
    // Émettre un événement pour créer une salle
    socket.emit("createRoom", {
      room: { name: name },
      name,
      password,
    });
=======

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
    
    if (socket && actionType === "joinRoom") {
      socket.emit(actionType, {
        identifier: name,
        isPrivate,
        ...(isPrivate && { password }),
      });

      return;
    }

    storeRoomData({
      name,
      isPrivate,
      password: isPrivate ? password : undefined,
    });

    setIsModalOpen(false);

    router.push("/room/settings");

    toast.info(`Destination : paramètres du salon "${name}". Préparez votre équipement !`);
>>>>>>> main
  };

  return (
    <div className="min-h-screen p-24 bg-[url('/landscape.svg')] flex items-center justify-center flex-col">
      <div>
        <h1 className="text-5xl">Que souhaitez-vous faire ?</h1>
      </div>
      <div className="flex items-center justify-center gap-10 m-10">
<<<<<<< HEAD
        <Dropdown
          menu={{
            items: itemsCreate,
          }}
          placement="bottomLeft"
          arrow
=======
        <button
          onClick={() => handleOpenModal("create")}
          className="px-7 py-4 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor"
>>>>>>> main
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

<<<<<<< HEAD
      <CreateRoomModal
        title={titleModale}
        isOpen={isModalOpen}
        onCancel={handleCancel}
        // onOk={handleCreateRoom}
        showPasswordInput={true}
        onOk={(values) => handleCreateRoom(values)}
      />

      <CreateRoomModal
        title={titleModale}
        isOpen={isModalOpenTwo}
        onCancel={handleCancelTwo}
        // onOk={handleCreateRoom}
        onOk={(values) => handleCreateRoom(values)}
        // isPrivate={true}
      />
=======
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
>>>>>>> main
    </div>
  );
}

<<<<<<< HEAD
export default Room;
=======
export default withAuth(Room);
>>>>>>> main
