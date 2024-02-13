"use client";
import React, { useEffect, useState } from "react";
import { Dropdown, Modal, Input } from "antd";
import { io } from "socket.io-client";
import withAuth from "@/app/middleware";
import { toast } from "sonner";
import CreateRoomModal from "../components/ModalComponent";

const SERVER_URL = "http://localhost:5000";
const socket = io(SERVER_URL, { autoConnect: false });

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
  const [titleModale, setTitleModale] = useState("");
  // const [name, setRoomName] = useState("");
  // const [password, setPassword] = useState("");

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      console.log("Connecté au serveur", socket);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
  };

  return (
    <div className="min-h-screen p-24 bg-mainColor flex items-center justify-center flex-col">
      <div>
        <h1 className="text-5xl">Que souhaitez-vous faire ?</h1>
      </div>
      <div className="flex items-center justify-center gap-10 m-10">
        <Dropdown
          menu={{
            items: itemsCreate,
          }}
          placement="bottomLeft"
          arrow
        >
          <a
            className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor w-full"
            style={{ whiteSpace: "nowrap" }}
          >
            Créer une salle
          </a>
        </Dropdown>
        <a
          href="/waiting-room"
          className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor w-full"
          style={{ whiteSpace: "nowrap" }}
        >
          Rejoindre une salle
        </a>
      </div>

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
    </div>
  );
}

export default Room;
