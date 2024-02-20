'use client';

import { BookOutlined, BulbFilled, BulbOutlined } from '@ant-design/icons';

import { useSocket } from '@/app/_context/SocketContext';
import { useState } from 'react';

const QuestionDisplay = ({ question, currentQuestionIndex, handleAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const socket = useSocket();

  const onAnswerClick = (answer, isCorrect) => {
    handleAnswer(isCorrect);
    setSelectedAnswer(answer);
  };

  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
  };

  return (
    <div className="mx-auto text-center mt-8 mb-8">
      {question.theme && (
        <div className="mb-14 flex justify-center items-center">
          <BookOutlined className="mr-2 text-lg text-blue-500" />
          <h2 className="text-xl font-bold inline">
            Thème spécifique: <span className="text-white">{question.theme}</span>
          </h2>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-20">Question {currentQuestionIndex + 1}: {question.question}</h2>
      <div className="grid grid-cols-2 gap-4 max-w-screen-lg mx-auto">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswerClick(answer, answer === question.correct_answer)}
            className={`w-full text-xl rounded-lg p-4 ${selectedAnswer === answer ? (answer === question.correct_answer ? 'bg-green-500' : 'bg-red-500') : 'bg-white text-gray-800'} transition-colors duration-300`}
          >
            {answer}
          </button>
        ))}
      </div>
      <div className="relative inline-block">
        <button
          className="mt-4 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleHint}
        >
          {isHintVisible ? <BulbFilled /> : <BulbOutlined />} Indice et Explications
        </button>
        {isHintVisible && (
          <div className="absolute bottom-full mb-2 w-64 p-4 bg-gray-400 text-gray-800 rounded shadow-lg">
            <p>Voici un indice pour la question.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;

