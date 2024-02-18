'use client';
import { useState, useEffect } from 'react';
import withAuth from "@/app/middleware";
import { useRoom } from '@/app/_context/RoomContext';

function WaitingHome() {
  const [participants, setParticipants] = useState([]);
  const REQUIRED_NUMBER_OF_PARTICIPANTS = 5; // À rendre dynamique
  const { roomSettings, room } = useRoom();

  useEffect(() => {
    console.log('setting est', roomSettings);
    console.log('room est', room);
    const fetchedParticipants = getNumberOfParticipantsFromLink();
    setParticipants(new Array(fetchedParticipants).fill('Participant')); 
  }, []);

  return (
    <main className="min-h-screen p-24 bg-[url('/landscape.svg')] flex items-center justify-center flex-col">
      {participants.length < REQUIRED_NUMBER_OF_PARTICIPANTS ? (
        <div>
          <p>En attente des autres participants...</p>
        </div>
      ) : (
        <div>
          <p>Nombre de participants atteint !</p>
          <button onClick={startGame} className="my-4 bg-green-500 text-white px-4 py-2 rounded">
            Commencer la partie
          </button>
        </div>
      )}

      <div>
        {participants.map((participant, index) => (
          <p key={index}>{participant}</p>
        ))}
      </div>
    </main>
  );
}

const getNumberOfParticipantsFromLink = () => {
  return Math.floor(Math.random() * 10) + 1;
};

const startGame = () => {
  // Commencer le jeu
  console.log("Début de la partie!");
};

export default withAuth(WaitingHome);