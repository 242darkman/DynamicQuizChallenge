"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import withAuth from "@/app/middleware";

function Settings() {
  const router = useRouter();

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