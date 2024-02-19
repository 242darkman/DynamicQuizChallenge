"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useRoom } from '@/app/_context/RoomContext';
import withAuth from "@/app/middleware";
import { useSocket } from '@/app/_context/SocketContext';
import { Progress } from 'antd';
import { toast } from "sonner";


function Question() {
  const router = useRouter();
  const { clearRoomData, serverResponse, room , storeServerResponse} = useRoom();
  const socket = useSocket();
  const [timer, setTimer] = useState(20);
  const [username, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [questions, setQuestions] = useState([]); 
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(room.room.settings.numberOfRounds);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const newGame = (() => {

    resetGameState();
    const toastLoading = toast.loading("Juste un instant, nous préparons les questions");
    const gameConfig = {
      theme: room.room.settings.theme,
      numberOfQuestions: room.room.settings.numberOfQuestions,
      numberOfRounds: room.room.settings.numberOfRounds
    };
    socket.emit('generateQuestionWithParams', gameConfig);
    socket.on('response', (response) => {
      storeServerResponse(response);

      if (response) {
        toast.dismiss(toastLoading);
      }
    });
  });

  useEffect(() => {
    newGame()
  }, [socket]);

  useEffect(() => {
    //clearRoomData();

    const token = localStorage.getItem('app_token');
    if (token) {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      setUser(payload.user.username);
    }

    if (questions.length > 0) {
      if (timer > 0) {
        const countdownInterval = setInterval(() => {
          setTimer(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(countdownInterval);
      } else {
        nextQuestion();
      }
    }
  }, [timer, questions]);

  // Initialisation des questions avec la réponse du serveur
  useEffect(() => {
    if (serverResponse && serverResponse.length >  0) {
      setQuestions(serverResponse);
    }
  }, [serverResponse]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(20);
    } else{
      nextRound();
    }
  }, [currentQuestionIndex, questions, userAnswers]);
  

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
    if (currentQuestionIndex === questions.length - 1) {
      setTimer(0);
    }
    else{
      nextQuestion();
    }
  };

  // Fonction pour joueur le tour suivant 
  const nextRound = () => {
    if (round === totalRounds) {
      toast.success("Bravo, la partie est terminer vérifions votre score");
      setRound(1);
      setRoundsCompleted(0);
      resetGameState();
      return;
    }
  
    setRound(round + 1);
    setRoundsCompleted(roundsCompleted + 1);
  
    if (roundsCompleted < totalRounds - 1) {
      newGame();
    }
  };

  // réinitialiser le jeu
  const resetGameState = () => {
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setTimer(20);
    setUserAnswers([]);
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
                percent={(timer / 20) * 100}
                strokeColor={timer > 5 ? '#52c41a' : '#f5222d'} 
                format={() => {
                  const countDown = 20 - timer;
                  if (countDown <= 0) {
                    return '00:20';
                  }
                  const minutes = Math.floor((20 - timer) / 60);
                  const seconds = Math.round(20 - countDown);
                  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }}
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
        <span className="mr-2">Score total : </span> {totalScore} 
        <span className="ml-2 ml-5">Round en cours : </span> {round}/{totalRounds}
      </div>
    </div>
  );
}
export default withAuth(Question);