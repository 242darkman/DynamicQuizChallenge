'use client';
import Image from "next/image";
import withAuth from "@/app/middleware";

function Room() {
  return (
    <main className="min-h-screen p-24 bg-mainColor flex items-center justify-center flex-col">
      <div>
        <h1 className="text-5xl">Que souhaitez-vous faire ?</h1>
      </div>
      <div className="flex items-center justify-center gap-10 m-10">
        <a
          href=""
          className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor w-full"
        >
          Créer une salle
        </a>
        <a
          href="/waiting-room"
          className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor w-full"
          style={{ whiteSpace: 'nowrap' }} >
         Rejoindre une salle
        </a>
      </div>
    </main>
  );
}

export default withAuth(Room);