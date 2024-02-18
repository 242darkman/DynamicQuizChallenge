"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRoom } from '@/app/_context/RoomContext';
import withAuth from "@/app/middleware";


function Question() {
  const router = useRouter();
  const { clearRoomData, serverResponse } = useRoom();
  const [timer, setTimer] = useState(15);
  const [username, setUser] = useState(null);

  useEffect(() => {
    clearRoomData();
    
    const token = localStorage.getItem('app_token');
    if (token) {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      setUser(payload.user.username);
    }

    console.log('la reponse est ici ', serverResponse);

    if (timer > 0) {
      const countdownInterval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [timer]);

  return (
    <div className="min-h-screen bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center">
     <div className="flex justify-between font-bold text-3xl pt-10 pb-20 ml-20 mr-20">
        {username && (
          <p className="text-m text-white">
            <span>Pseudo:</span> {username}
          </p>
        )}
        <div>
            <span>Chrono :</span> {timer}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-14 max-w-screen-lg mx-auto">
        <button className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor">
          Mercure
        </button>
        <button className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor">
          Vénus
        </button>
        <button className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor">
          Mars
        </button>
        <button className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor">
          Jupiter
        </button>
      </div>
    </div>
  );
}


export default withAuth(Question);