"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Question() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-mainColor">
      <div className="flex justify-between p-10">
        <p className="text-m">Votre pseudo</p>
        <div className="text-m">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-m">15:20</p>
        </div>
      </div>
      <h1 className="font-bold text-3xl pt-10 pb-20 flex flex-col items-center justify-center ">
        Quelle est la planète la plus petite du système solaire ?
      </h1>

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
