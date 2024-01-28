"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Settings() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-mainColor">
      <div className="p-12 bg-white/100 backdrop-blur-sm rounded shadow-lg w-1/2 border">
        <h2 className="text-2xl font-bold text-center text-mainColor">
          Paramètres du quiz
        </h2>
        <form className="space-y-4 mt-10">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-mainColor"
            >
              Thème
            </label>
            <select
              defaultValue="general"
              id="topic"
              className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none  focus:ring focus:border-secondColor block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-mainColor dark:focus:ring dark:focus:ring-secondColor dark:focus:border-mainColor"
            >
              <option value="general">Culture générale</option>
              <option value="music">Musique</option>
              <option value="sciences">Sciences</option>
              <option value="literature">Littérature</option>
              <option value="sport">Sport</option>
              <option value="random">Aléatoire</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium text-mainColor"
            >
              Niveau
            </label>
            <select
              defaultValue="easy"
              id="level"
              className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none  focus:ring focus:border-secondColor block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-mainColor dark:focus:ring dark:focus:ring-secondColor dark:focus:border-mainColor"
            >
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="difficult">Difficile</option>
              <option value="mixed">Mixte</option>
            </select>
          </div>
          <div>
            <label
              defaultValue="easy"
              htmlFor="number_question"
              className="block text-sm font-medium text-mainColor"
            >
              Nombre de questions
            </label>
            <select
              defaultValue="nb10"
              id="number_question"
              className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none  focus:ring focus:border-secondColor block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-mainColor dark:focus:ring dark:focus:ring-secondColor dark:focus:border-mainColor"
            >
              <option value="nb10">10</option>
              <option value="nbQuestion15">15</option>
              <option value="nbQuestion20">20</option>
              <option value="nbQuestion25">25</option>
              <option value="nbQuestion30">30</option>
            </select>
          </div>
          <div>
            <label
              defaultValue="nbRound1"
              htmlFor="number_round"
              className="block text-sm font-medium text-mainColor"
            >
              Nombre de tours
            </label>
            <select
              id="number_round"
              className="bg-white border border-gray-300 text-mainColor text-sm rounded-lg focus:outline-none  focus:ring focus:border-secondColor block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-mainColor dark:focus:ring dark:focus:ring-secondColor dark:focus:border-mainColor"
            >
              <option value="nbRound1">1</option>
              <option value="nbRound2">2</option>
              <option value="nbRound3">3</option>
              <option value="nbRound4">4</option>
              <option value="nb3nbRound5">5</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 text-white bg-mainColor rounded hover:bg-secondColor focus:outline-none focus:ring focus:ring-secondColor"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
