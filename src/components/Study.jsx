import { useState, useEffect, useMemo } from 'react';
import { vocabularyData } from '../data/vocabulary';

// Utility to shuffle array
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Study({ day, onFinish, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); // true, false, or null
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize questions (Learning Mode: Go through all words once)
  useEffect(() => {
    const words = vocabularyData[day];
    if (!words) return;

    const quizSet = words.map(target => {
      // Get 3 random words excluding target for distractors
      const others = words.filter(w => w.id !== target.id);
      const distractors = shuffle(others).slice(0, 3);
      const options = shuffle([target, ...distractors]);
      return {
        target,
        options
      };
    });

    // For study mode, maybe keep them in order? Or shuffle?
    // "Learning" usually implies order might help, but random is better for testing.
    // Let's shuffle to make it a "Game-like" learning.
    setQuestions(shuffle(quizSet));
  }, [day]);

  // Audio Playback
  const playAudio = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Play audio when question changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      playAudio(questions[currentIndex].target.word);
    }
  }, [currentIndex, questions]);

  const handleOptionClick = (option) => {
    if (isProcessing) return;
    // Don't block interaction immediately if wrong, let them try again?
    // User request: "Select answer from 4 choices"
    // If wrong: "Buzz" sound, highlight wrong.
    // If right: "Ding", Next.

    const currentQ = questions[currentIndex];

    if (option.id === currentQ.target.id) {
      // Correct!
      setIsProcessing(true);
      setSelectedOption(option);
      setIsCorrect(true);

      // Auto advance
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          setIsProcessing(false);
        } else {
          // End of Study
          onFinish();
        }
      }, 1000);
    } else {
      // Wrong!
      setSelectedOption(option);
      setIsCorrect(false);
      // Don't advance, let them try again.
      // Maybe shake effect?
      setTimeout(() => {
        setSelectedOption(null); // Reset selection to allow retry
        setIsCorrect(null);
      }, 500);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="study-container">
      <div className="header">
        <button className="btn-icon" onClick={onBack}>⬅️</button>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="counter">{currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="question-area">
        <div className="word-card">
          <span className="word-text">{currentQ.target.word}</span>
          <button
            className="btn-audio"
            onClick={() => playAudio(currentQ.target.word)}
          >
            🔊
          </button>
        </div>
      </div>

      <div className="options-grid">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "btn-option";
          // Visual feedback logic
          if (selectedOption === opt) {
            if (isCorrect === true) btnClass += " correct"; // Selected & Correct
            if (isCorrect === false) btnClass += " wrong";   // Selected & Wrong
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleOptionClick(opt)}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>

      <style>{`
        .study-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .btn-icon {
          background: none;
          font-size: 1.5rem;
          padding: 0;
        }
        .progress-bar-container {
            flex: 1;
            height: 10px;
            background: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: var(--color-secondary);
            transition: width 0.3s;
        }
        .counter {
            font-weight: bold;
            color: #999;
        }

        .question-area {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
        }
        .word-card {
            background: white;
            padding: 40px;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-card);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            text-align: center;
            animation: float 3s ease-in-out infinite;
        }
        .word-text {
            font-size: 3.5rem;
            font-weight: 700;
            color: var(--color-accent);
            font-family: var(--font-eng);
        }
        .btn-audio {
            background: var(--color-primary);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 0 rgba(0,0,0,0.15);
            transition: transform 0.1s;
        }
        .btn-audio:active {
            transform: scale(0.95);
        }

        .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            padding-bottom: 20px;
        }
        .btn-option {
            background: white;
            border: 3px solid #eee;
            padding: 20px;
            border-radius: var(--radius-md);
            font-size: 1.3rem;
            color: var(--color-text);
            box-shadow: 0 4px 0 rgba(0,0,0,0.05);
            transition: all 0.2s;
            font-weight: bold;
        }
        .btn-option:active {
            transform: scale(0.98);
        }
        .correct {
            background: var(--color-secondary) !important;
            color: white !important;
            border-color: var(--color-secondary) !important;
            animation: bounce 0.5s;
        }
        .wrong {
            background: var(--color-danger) !important;
            color: white !important;
            border-color: var(--color-danger) !important;
            animation: shake 0.4s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
