'use client';
import { useState, useEffect } from 'react';
import withAuth from "@/app/middleware";
import { useRoom } from '@/app/_context/RoomContext';
import { useSocket } from '@/app/_context/SocketContext';
import { useRouter } from "next/navigation";
import { Spin } from 'antd'; 
import { toast } from "sonner";


function WaitingHome() {
  const [participants, setParticipants] = useState([]);
  const REQUIRED_NUMBER_OF_PARTICIPANTS = 5; 
  const { roomSettings, room, storeServerResponse } = useRoom();
  const socket = useSocket();
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const fetchedParticipants = getNumberOfParticipantsFromLink();
    setParticipants(new Array(fetchedParticipants).fill('Participant')); 
  }, []);

  
  //Gérer le clique pour débuter le quizz
  const startGame = () => {
    setSpinning(true);
    const toastLoading = toast.loading("Juste un instant, nous préparons les questions");
    const gameConfig = {
      theme: room.room.settings.theme,
      numberOfQuestions: room.room.settings.numberOfQuestions,
      numberOfRounds: room.room.settings.numberOfRounds
    };
    socket.emit('generateQuestionWithParams', gameConfig);

    // Ecouter la réponse du serveur
    socket.on('response', (responses) => {
      storeServerResponse(responses);

      // Vérifiez si la réponse a été reçue avant de rediriger
      if (responses) {
        toast.dismiss(toastLoading);
        setSpinning(false);
        router.push('/room/question');
      }
    });
  };

  return (    
    <main className="min-h-screen p-24 bg-mainColor flex items-center justify-center flex-col bg-[url('/landscape.svg')] bg-cover bg-center">

      <button onClick={startGame} className="my-4 bg-green-500 text-white px-4 py-2 rounded">
        Commencer la partie
      </button>


      {participants.length < REQUIRED_NUMBER_OF_PARTICIPANTS ? (
        <div>
          <p>En attente des autres participants...</p>
        </div>
      ) : (
        <div>
          <p>Nombre de participants atteint !</p>
          <button onClick={startGame} className="my-4 bg-green-500 text-white px-4 py-2 rounded">
            Ancien
          </button>
        </div>
      )}

      <div>
        {participants.map((participant, index) => (
          <p key={index}>{participant} </p>
        ))}
      </div>
      <Spin spinning={spinning} fullscreen />
    </main>
    
  );
}

const getNumberOfParticipantsFromLink = () => {
  return Math.floor(Math.random() * 10) + 1;
};


export default withAuth(WaitingHome);