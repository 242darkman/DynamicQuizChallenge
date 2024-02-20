"use client";

import { translateLevelValueToFrench, translateThemeValueToFrench } from "@/app/_constants/translationMap";
import { useCallback, useEffect, useMemo, useState } from "react";

import FooterUI from "@/app/_components/ui/FooterUI";
import HeaderUI from "@/app/_components/ui/HeaderUI";
import QuestionDisplay from "@/app/_components/QuestionDisplay";
import { Spin } from 'antd';
import { toast } from "sonner";
import { useAuth } from "@/app/_context/AuthContext";
import { useRoom } from '@/app/_context/RoomContext';
import { useRouter } from "next/navigation";
import { useSocket } from '@/app/_context/SocketContext';
import withAuth from "@/app/middleware";

//Fonction pour mélanger les questions
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function Question() {
  const router = useRouter();
  const { serverResponse, room , storeServerResponse, storeScore} = useRoom();
  const socket = useSocket();
  const { user, logout } = useAuth();
  const [timer, setTimer] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [questions, setQuestions] = useState([]); 
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(1);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Juste un instant, nous préparons les questions...");
  const roomSettings = useMemo(() => room && room.room && room.room.settings ? room.room.settings : {}, [room]);
  const totalRounds = useMemo(() => roomSettings.numberOfRounds, [roomSettings]);
  const currentDifficulty = translateLevelValueToFrench(roomSettings.level);
  const currentTheme = translateThemeValueToFrench(roomSettings.theme);

  const newGame = (() => {

    resetGameState();

    const loadingMsg = round === totalRounds
      ? "Juste un instant, nous préparons les questions pour votre dernier tour..."
      : round > 1
      ? "Juste un instant, nous préparons les questions pour le prochain tour..."
      : "Juste un instant, nous préparons les questions...";
    setLoadingMessage(loadingMsg);

    const gameConfig = {
      theme: roomSettings.theme,
      numberOfQuestions: roomSettings.numberOfQuestions,
      numberOfRounds: roomSettings.numberOfRounds
    };
    socket.emit('generateQuestionWithParams', gameConfig);
    socket.on('response', (response) => {
      if (response) {
        storeServerResponse(response);
        setIsLoading(false);
      }
    });
  });

  useEffect(() => {
    setIsLoading(true);
    newGame()
  }, [round]);

  useEffect(() => {
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
      setQuestions(serverResponse.map((question) => ({
        ...question,
        answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
    })));
    }
  }, [serverResponse]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30);
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
      const baseScoreForAccuracy = isCorrect ? 100 : 0; // Points basés sur la précision
      const speedBonus = isCorrect ? (timer / 45) * 50 : 0; // Points bonus pour la vitesse
      const scoreToAdd = baseScoreForAccuracy + speedBonus;
      
      setTotalScore((score) => Math.ceil(score + scoreToAdd));
    }

    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        setTimer(0);
      }
      else{
        nextQuestion();
      }
    }, 1000)
  };

  // Fonction pour joueur le tour suivant 
  const nextRound = () => {
    if (round === totalRounds) {
      toast.success("Bravo, la partie est terminer vérifions votre score");
      storeScore(totalScore);
      setRound(1);
      setRoundsCompleted(0);
      resetGameState();
      router.push('/room/ranking');
    }
  
    setIsLoading(true);
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
    setTimer(30);
    setUserAnswers([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center">
      <HeaderUI
        username={user ? user.username : 'N/A'}
        timer={timer}
        theme={currentTheme}
        difficulty={currentDifficulty}
        isPrivate={room && room.room ? room.room.isPrivate : false}
        roomName={room && room.room ? room.room.name : 'N/A'}
      />

      <div className="flex-grow flex items-center justify-center bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center p-4">
        {isLoading ? (
          <>
            <div className="text-center text-white">
              <Spin size="large" />
              <p>{loadingMessage}</p>
            </div>
          </>
        ) : (
          questions.length > 0 && currentQuestionIndex < questions.length && (
            <QuestionDisplay
              question={questions[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              handleAnswer={handleAnswer}
            />
          )
        )}
      </div>

      <FooterUI
        totalScore={totalScore}
        round={round}
        totalRounds={totalRounds}
      />
    </div>
  );
}
export default withAuth(Question);