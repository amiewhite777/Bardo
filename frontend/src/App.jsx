import { useState, useEffect } from 'react';
import './App.css';
import Quiz from './pages/Quiz';
import Result from './pages/Result';

function App() {
  const [currentView, setCurrentView] = useState('start'); // start, quiz, result
  const [quizData, setQuizData] = useState(null);
  const [result, setResult] = useState(null);

  // Load quiz data
  useEffect(() => {
    fetch('/data/quiz_data_questions.json')
      .then(res => res.json())
      .then(data => setQuizData(data))
      .catch(err => console.error('Failed to load quiz data:', err));
  }, []);

  const startQuiz = () => {
    setCurrentView('quiz');
    setResult(null);
  };

  const handleQuizComplete = async (responses) => {
    try {
      // Send responses to scoring API
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `session-${Date.now()}`,
          startTime: Date.now(),
          responses,
          completed: true
        })
      });

      const scoringResult = await response.json();
      setResult(scoringResult);
      setCurrentView('result');
    } catch (error) {
      console.error('Scoring failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const restartQuiz = () => {
    setCurrentView('start');
    setResult(null);
  };

  if (!quizData) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {currentView === 'start' && (
        <div className="start-screen">
          <h1>The Afterlife Quiz</h1>
          <p className="subtitle">A Universal Psychological Assessment</p>
          <p className="description">
            Discover your psychological form through {quizData.metadata.totalQuestions} carefully
            crafted questions. This assessment explores your patterns across multiple dimensions
            of human experience.
          </p>
          <div className="start-info">
            <div className="info-item">
              <strong>{quizData.metadata.totalQuestions}</strong>
              <span>Questions</span>
            </div>
            <div className="info-item">
              <strong>~10 min</strong>
              <span>Duration</span>
            </div>
            <div className="info-item">
              <strong>62</strong>
              <span>Possible Forms</span>
            </div>
          </div>
          <button className="start-button" onClick={startQuiz}>
            Begin Assessment
          </button>
          <p className="note">Answer honestly for the most accurate results</p>
        </div>
      )}

      {currentView === 'quiz' && (
        <Quiz quizData={quizData} onComplete={handleQuizComplete} />
      )}

      {currentView === 'result' && (
        <Result result={result} onRestart={restartQuiz} />
      )}
    </div>
  );
}

export default App;
