"use client";
import React, { useEffect, useState } from "react";
import { Dropdown, Modal, Input } from "antd";
import { io } from "socket.io-client";
import withAuth from "@/app/middleware";
import { toast } from "sonner";

const SERVER_URL = "http://localhost:5000";
const socket = io(SERVER_URL, { autoConnect: false });

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModale, setTitleModale] = useState("");
  const [name, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      console.log("Connecté au serveur", socket);
    });

    return () => {
      socket.disconnect();
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
      label: <a>Publique</a>,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * Méthode pour créer une salle
   * @param {*} event
   * @returns
   */
  const handleOkPrivate = async (event) => {
    event.preventDefault();
    if (!name || !password) {
      toast.error(
        "Oups, il semblerait que vous ayez oublié de remplir un champ (ou deux). Merci de les compléter !"
      );
      return;
    }

    //console.log("le name est ", name);

    // Émettre un événement pour créer une salle
    socket.emit("createRoom", {
      // room: { name: name },
      name,
      isPrivate: true,
      password,
    });

    setRoomName("");
    setPassword("");
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

      <Modal
        title={titleModale}
        open={isModalOpen}
        okText="Valider"
        okButtonProps={{ className: "bg-blue-500" }}
        onOk={handleOkPrivate}
        onCancel={handleCancel}
      >
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Nom de la salle"
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
