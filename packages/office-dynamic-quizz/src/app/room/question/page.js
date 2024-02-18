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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Ajout de l'état pour suivre l'index de la question actuelle
  const [questions, setQuestions] = useState([]); // Ajout de l'état pour stocker les questions
  const [userAnswers, setUserAnswers] = useState([]); // Ajout de l'état pour stocker les réponses de l'utilisateur

  useEffect(() => {
    clearRoomData();
    
    const token = localStorage.getItem('app_token');
    if (token) {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      setUser(payload.user.username);
    }

    if (timer > 0) {
      const countdownInterval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [timer]);

  // Initialisation des questions avec la réponse du serveur
  useEffect(() => {
    if (serverResponse && serverResponse.length >  0) {
      setQuestions(serverResponse);
    }
  }, [serverResponse]); // Ajout de serverResponse comme dépendance

  // Fonction pour passer à la question suivante
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length -  1) {
      setCurrentQuestionIndex(currentQuestionIndex +  1);
    } else {
      console.log('la fin du jeu');
    }
  };

  // Fonction pour enregistrer la réponse de l'utilisateur et passer à la question suivante
  const handleAnswer = (isCorrect) => {
    const answer = {
      questionIndex: currentQuestionIndex,
      isCorrect: isCorrect,
    };
    setUserAnswers([...userAnswers, answer]);
    nextQuestion();
  };

  // Récupérer la question actuelle
  const currentQuestion = questions[currentQuestionIndex];




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

      <div className="question-container">
        {currentQuestion && (
          <div className="question-wrapper mx-auto text-center mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-20">{currentQuestion.question}</h2>
            <div className="grid grid-cols-2 gap-4 max-w-screen-lg mx-auto h-60">
              {currentQuestion.incorrect_answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(false)}
                  className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor"
                >
                  {answer}
                </button>
              ))}
              <button
                onClick={() => handleAnswer(true)}
                className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor"
              >
                {currentQuestion.correct_answer}
              </button>
            </div>
          </div>
        )}
      </div>




    </div>
  );
}


export default withAuth(Question);