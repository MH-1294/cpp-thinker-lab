import React, { useState, useEffect } from 'react';
import { questions as defaultQuestions } from '../data/questions';

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function Quiz({ isAuthenticated, onRequireAuth }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('cs110_username') || '');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

  // Prepare the quiz dynamically on start
  const prepareQuiz = () => {
    // 1. Load Custom Questions
    let mergedQuestions = Array.isArray(defaultQuestions) ? [...defaultQuestions] : [];
    const savedCustom = localStorage.getItem('cs110_custom_mcq');
    if (savedCustom) {
      try {
        const customQ = JSON.parse(savedCustom);
        if (Array.isArray(customQ)) mergedQuestions = [...mergedQuestions, ...customQ];
      } catch (e) {
        console.error("Error loading custom questions", e);
      }
    }

    // 2. Load Settings
    const settings = JSON.parse(localStorage.getItem('cs110_quiz_settings') || '{}');
    const numQuestions = settings.numQuestions || 5;
    const shuffleQ = settings.shuffleQuestions ?? true;
    const shuffleOpt = settings.shuffleOptions ?? true;

    // 3. Shuffle Questions if needed
    if (shuffleQ) {
      mergedQuestions = shuffleArray(mergedQuestions);
    }

    // 4. Slice to desired number
    let selectedQuestions = mergedQuestions.slice(0, numQuestions);

    // 5. Shuffle Options if needed
    if (shuffleOpt) {
      selectedQuestions = selectedQuestions.map(q => {
        // Deep copy the options to avoid mutating the original data
        const originalOptions = [...q.options];
        const correctString = originalOptions[q.correctAnswer];
        
        const shuffledOptions = shuffleArray(originalOptions);
        const newCorrectAnswerIndex = shuffledOptions.indexOf(correctString);

        return {
          ...q,
          options: shuffledOptions,
          correctAnswer: newCorrectAnswerIndex
        };
      });
    }

    setAllQuestions(selectedQuestions);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in or create an account to start the assessment. Your score will be saved to the Class Leaderboard.");
      if (onRequireAuth) onRequireAuth();
      return;
    }
    
    // Fallback if somehow userName is empty despite being auth'd
    const nameToSave = userName.trim() || 'Student';
    localStorage.setItem('cs110_username', nameToSave);
    prepareQuiz(); // Initialize exactly when they start!
    setStartTime(Date.now());
    setIsStarted(true);
  };

  const currentQ = allQuestions[currentQuestionIndex] || { options: [] };

  const handleSelectOption = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < allQuestions.length) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finishTime = Date.now();
      const secondsTaken = Math.floor((finishTime - startTime) / 1000);
      setTimeTaken(secondsTaken);

      const existingData = JSON.parse(localStorage.getItem('cs110_leaderboard')) || [];
      const newEntry = { 
        name: userName, 
        score, 
        total: allQuestions.length, 
        timeTaken: secondsTaken,
        date: new Date().toLocaleDateString() 
      };
      localStorage.setItem('cs110_leaderboard', JSON.stringify([...existingData, newEntry]));
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
    setStartTime(Date.now());
    prepareQuiz(); // Reshuffle for the new attempt!
  };

  const renderTextWithCode = (text) => {
    if (!text) return null;
    const parts = text.split('\`\`\`');
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const codeContent = part.replace(/^cpp\n/, '');
        return (
          <pre key={i} style={{ margin: '1rem 0' }}>
            <code>{codeContent}</code>
          </pre>
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\\n/g, '<br/>') }} />;
    });
  };

  if (!isStarted) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-gradient mb-4"><span className="ali-highlight">Assessment Ready</span></h2>
        <p className="mb-4">Welcome{userName ? `, ${userName}` : ''}! The quiz will test your knowledge on C++ fundamentals.</p>
        <button onClick={handleStart} className="btn" style={{ width: '100%' }}>Start Assessment</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient">Assessment Complete!</h2>
        <div className="score-display">
          {score} / {allQuestions.length}
        </div>
        <p className="mb-4">
          {score === allQuestions.length ? "Perfect score! You have a solid grasp of these concepts." : 
           score > allQuestions.length / 2 ? "Good job! Review the concepts you missed to achieve mastery." : 
           "Keep practicing! Programming is a journey, review the newcomer guide and the textbook."}
        </p>
        <button className="btn" onClick={handleRestart}>Retake Assessment</button>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--accent-color)' }}>
        <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
        <span>{currentQ.category || 'Custom'}</span>
      </div>

      <div className="question-container">
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
          {renderTextWithCode(currentQ.question)}
        </h3>

        <div className="options-grid">
          {currentQ.options.map((option, index) => {
            let className = "option-btn";
            if (showExplanation) {
              if (index === currentQ.correctAnswer) className += " correct";
              else if (index === selectedAnswer) className += " incorrect";
            } else if (selectedAnswer === index) {
              className += " selected";
            }

            return (
              <button 
                key={index} 
                className={className}
                onClick={() => handleSelectOption(index)}
                disabled={showExplanation}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="feedback animate-fade-in">
          <h4 className={selectedAnswer === currentQ.correctAnswer ? "text-gradient" : ""} style={{ color: selectedAnswer === currentQ.correctAnswer ? 'var(--success-color)' : 'var(--error-color)', marginBottom: '0.5rem' }}>
            {selectedAnswer === currentQ.correctAnswer ? "Correct!" : "Incorrect."}
          </h4>
          <p>{currentQ.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        {!showExplanation ? (
          <button className="btn" onClick={handleSubmit} disabled={selectedAnswer === null}>
            Submit Answer
          </button>
        ) : (
          <button className="btn" onClick={handleNext}>
            {currentQuestionIndex + 1 === allQuestions.length ? "Finish Assessment" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}
