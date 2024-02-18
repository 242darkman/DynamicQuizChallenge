"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRoom } from '@/app/_context/RoomContext';
import withAuth from "@/app/middleware";
import { Progress } from 'antd';

function Question() {
  const router = useRouter();
  const { clearRoomData, serverResponse } = useRoom();
  const [timer, setTimer] = useState(20);
  const [username, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [questions, setQuestions] = useState([]); 
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

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
    else{
      nextQuestion();
    }
  }, [timer]);

  // Initialisation des questions avec la réponse du serveur
  useEffect(() => {
    if (serverResponse && serverResponse.length >  0) {
      setQuestions(serverResponse);
    }
  }, [serverResponse]);

  // Fonction pour passer à la question suivante
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length -  1) {
      setCurrentQuestionIndex(currentQuestionIndex +  1);
      setTimer(20);
    } else {
      console.log('la fin du jeu');
      setTimer(0);
    }
  };

  // Fonction pour enregistrer la réponse de l'utilisateur et passer à la question suivante
  const handleAnswer = (isCorrect) => {
    const answer = {
      questionIndex: currentQuestionIndex,
      isCorrect: isCorrect,
    };
    setUserAnswers([...userAnswers, answer]);

    // Calculez le score de la question
    if (isCorrect) {
      const questionScore = timer *   10;
      setTotalScore(prevScore => prevScore + questionScore);
    }
    nextQuestion();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center">

      <div className="flex justify-between font-bold text-3xl pt-10 pb-20 ml-20 mr-40">
          {username && (
            <p className="text-m text-white">
              <span>Pseudo:</span> {username}
            </p>
          )}
          <div>
            <span className="mr-3">Chrono :</span> 
            <Progress
              type="circle"
              percent={(timer /  20) *  100}
              strokeColor={timer >  5 ? '#52c41a' : '#f5222d'} 
              format={() => `${Math.round((timer /   20) *   100)}%`}
              size={80}
            />
          </div>
      </div>

      <div className="question-container">
        {currentQuestion && (
          <div className="question-wrapper mx-auto text-center mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-20">
              Question {currentQuestionIndex +  1} : {currentQuestion.question}
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-screen-lg mx-auto h-60">
              {currentQuestion.incorrect_answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(false)}
                  className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor rounded-lg"
                >
                  {answer}
                </button>
              ))}
              <button
                onClick={() => handleAnswer(true)}
                className="btn bg-white w-full text-xl text-mainColor hover:bg-secondColor rounded-lg"
              >
                {currentQuestion.correct_answer}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center font-bold text-3xl pt-10 pb-20 ml-20 mr-20">
        <span>Score total :</span> {totalScore}
      </div>

    </div>
  );
}
export default withAuth(Question);