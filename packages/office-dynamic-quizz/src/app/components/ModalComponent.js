import React, { useState } from "react";
import { Modal, Input } from "antd";
import { toast } from "sonner";

const CreateRoomModal = ({
  title,
  isOpen,
  onCancel,
  onOk,
  showPasswordInput,
}) => {
  const [name, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!name) {
      toast.error("Veuillez entrer le nom de la salle!");
      return;
    }

    if (showPasswordInput && !password) {
      toast.error("Veuillez entrer un mot de passe.");
      return;
    }

    onOk({ name, password });
    setRoomName("");
    setPassword("");
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      okText="Valider"
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ className: "bg-blue-500" }}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <div className="flex flex-col gap-5">
        <Input
          name="nameRoom"
          placeholder="Nom de la salle"
          value={name}
          onChange={(e) => setRoomName(e.target.value)}
        />
        {showPasswordInput && (
          <Input
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
};

export default CreateRoomModal;
