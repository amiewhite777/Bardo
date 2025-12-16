import { useState } from 'react';
import './Quiz.css';

export default function Quiz({ quizData, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  const handleAnswer = (optionId) => {
    const newResponse = {
      questionId: currentQuestion.id,
      optionId,
      timestamp: Date.now(),
      timeToAnswer: 0 // Can track this if needed
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    // Move to next question or complete quiz
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(updatedResponses);
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setResponses(responses.slice(0, -1));
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          Question {currentQuestionIndex + 1} of {quizData.questions.length}
        </div>
      </div>

      <div className="question-container">
        <h2 className="question-text">{currentQuestion.text}</h2>
        
        <div className="options-container">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              className="option-button"
              onClick={() => handleAnswer(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {currentQuestionIndex > 0 && (
        <button className="back-button" onClick={goBack}>
          ← Back
        </button>
      )}
    </div>
  );
}
