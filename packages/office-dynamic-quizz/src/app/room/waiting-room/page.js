'use client';
import { useState, useEffect } from 'react';
import withAuth from "@/app/middleware";
import { useSocket } from '@/app/_context/SocketContext';
import { useRouter } from "next/navigation";


function WaitingHome() {
  const [participants, setParticipants] = useState([]);
  const socket = useSocket();
  const router = useRouter();


  useEffect(() => {
    socket.emit('getAllParticipantsInJoinedRooms');

    socket.on('allParticipants', (participants) => {
      if (participants) {
        setParticipants(participants);
      }
    });

    socket.on('updateJoinedRooms', (participants) => {
      if (participants) {
        setParticipants(participants);
      }
    });

    socket.on('redirectToGamePage', () => {
      router.push('/room/question');
    });

  },[socket]);
  
  //Gérer le clique pour débuter le quizz
  const startGame = () => {
    socket.emit('startGame');
    router.push('/room/question');
  };

  return (    
    <main className="min-h-screen p-24 bg-mainColor flex items-center justify-center flex-col bg-[url('/landscape.svg')] bg-cover bg-center">

      <button onClick={startGame} className="my-4 bg-green-500 text-white px-4 py-2 rounded">
        Commencer la partie
      </button>

      <p>Les participants ... </p>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant.user_username}</li>
        ))}
      </ul>

    </main>
  );
}


export default withAuth(WaitingHome);