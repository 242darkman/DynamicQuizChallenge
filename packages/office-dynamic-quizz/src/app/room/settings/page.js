"use client";

import { levels, numberOfQuestionsOptions, numberOfRoundsOptions, themes } from "@/app/_constants/settingsOptions";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useRoom } from '@/app/_context/RoomContext';
import { useRouter } from "next/navigation";
import { useSocket } from '@/app/_context/SocketContext';
import withAuth from "@/app/middleware";

function RoomSettings() {
  const router = useRouter();
  const { roomData, roomSettings, storeRoomSettings, clearRoomData } = useRoom();
  const [theme, setTheme] = useState("general");
  const [level, setLevel] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState("10");
  const [numberOfRounds, setNumberOfRounds] = useState("1");
  const socket = useSocket();

  useEffect(() => {
    if (socket) {

      const handleError = (error) => {
        console.error("Error from server:", error);
        toast.error("Un petit souci... le serveur fait des siennes !");
      };

      socket.on('error', handleError);

      socket.on('createRoomResponse', (response) => {
        if (response.success) {
          toast.success(`Salle "${roomData.name}" créée avec succès. veuillez rejoindre le salon...`);
          router.push("/room");
          return;
        } 
        
        toast.error(response.message || `Erreur lors de la création de la salle "${roomData.name}".`);
      });

      return () => {
        socket.off('error', handleError);
      };
    }
  }, [socket, router, clearRoomData, roomData]);

  const createRoom = (room) => {
    if (socket) {
      socket.emit('createRoom', room);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    const settings = {
      theme,
      level,
      numberOfQuestions: parseInt(numberOfQuestions, 10),
      numberOfRounds: parseInt(numberOfRounds, 10),
    };

    storeRoomSettings(settings);

    const newRoom = {
      room: roomData,
      settings,
    };
    
    if (roomData && settings) {
      createRoom(newRoom);
    }

    toast.error(`Paramètres enregistrés pour "${newRoom.room.name}" non valides. Les matériaux de construction du salon ne sont pas bons...`);

    return;
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center">
      <div className="p-12 bg-white/100 backdrop-blur-sm rounded shadow-lg w-1/2 border">
        <h2 className="text-2xl font-bold text-center text-mainColor">
          Paramètres du salon
        </h2>
        <form onSubmit={handleCreateRoom} className="space-y-4 mt-10">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-mainColor">Thème</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} id="topic" className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none focus:ring focus:border-secondColor block w-full p-2.5">
              {themes.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-mainColor">Niveau</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} id="level" className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none focus:ring focus:border-secondColor block w-full p-2.5">
              {levels.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="number_question" className="block text-sm font-medium text-mainColor">Nombre de questions</label>
            <select value={numberOfQuestions} onChange={(e) => setNumberOfQuestions(e.target.value)} id="number_question" className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none focus:ring focus:border-secondColor block w-full p-2.5">
              {numberOfQuestionsOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="number_round" className="block text-sm font-medium text-mainColor">Nombre de tours</label>
            <select value={numberOfRounds} onChange={(e) => setNumberOfRounds(e.target.value)} id="number_round" className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none focus:ring focus:border-secondColor block w-full p-2.5">
              {numberOfRoundsOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="w-1/2 px-4 py-2 text-white bg-mainColor rounded hover:bg-secondColor focus:outline-none focus:ring focus:ring-secondColor">
              Créer le salon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(RoomSettings);