import { useState, useEffect } from 'react';
import { vocabularyData } from '../data/vocabulary';
import confetti from 'canvas-confetti';

// Utility to shuffle array
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Study({ day, onFinish, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  // Initialize questions
  useEffect(() => {
    const words = vocabularyData[day];
    if (!words) return;

    const quizSet = words.map(target => {
      const others = words.filter(w => w.id !== target.id);
      const distractors = shuffle(others).slice(0, 3);
      const options = shuffle([target, ...distractors]);
      return { target, options };
    });

    setQuestions(shuffle(quizSet));
    setCurrentIndex(0);
    setStats({ correct: 0, wrong: 0 });
    setShowStats(false);
  }, [day]);

  // Audio Playback
  const playAudio = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!showStats && questions.length > 0 && currentIndex < questions.length) {
      playAudio(questions[currentIndex].target.word);
    }
  }, [currentIndex, questions, showStats]);

  const handleOptionClick = (option) => {
    if (isProcessing || showStats) return;

    const currentQ = questions[currentIndex];

    if (option.id === currentQ.target.id) {
      // Correct
      setIsProcessing(true);
      setSelectedOption(option);
      setIsCorrect(true);
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#6BCB77', '#FFD93D']
      });

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          setIsProcessing(false);
        } else {
          finishChapter();
        }
      }, 1200);
    } else {
      // Wrong
      setSelectedOption(option);
      setIsCorrect(false);
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));

      // Allow retry after delay
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  const finishChapter = () => {
    setShowStats(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (questions.length === 0) return <div>Loading...</div>;

  // Stats View
  if (showStats) {
    const total = stats.correct + stats.wrong;
    // Just count questions for "Great Job" context
    const questionCount = questions.length;
    const accuracy = Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) || 0; // simplistic since we allow retries, stats.wrong increases
    // Better stat: "Mistakes made"

    let message = "Amazing!";
    if (stats.wrong === 0) message = "Perfect! Genius! 🌟";
    else if (stats.wrong <= 3) message = "Great Job! 🎉";
    else message = "Good Effort! Keep practicing! 💪";

    return (
      <div className="study-container stats-view">
        <h1 className="stats-title">Chapter Complete!</h1>
        <div className="stats-card">
          <div className="stat-emoji">{stats.wrong === 0 ? '🏆' : '🎯'}</div>
          <p className="stat-message">{message}</p>
          <div className="stat-details">
            <p>Words Learned: {questionCount}</p>
            <p>Mistakes: {stats.wrong}</p>
          </div>
        </div>
        <button className="btn-primary" onClick={onFinish}>Finish</button>
      </div>
    );
  }

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
          {isCorrect === true && <div className="feedback-emoji correct">😍</div>}
          {isCorrect === false && <div className="feedback-emoji wrong">😢</div>}
        </div>
      </div>

      <div className="options-grid">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "btn-option";
          if (selectedOption === opt) {
            if (isCorrect === true) btnClass += " correct";
            if (isCorrect === false) btnClass += " wrong";
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
        .stats-view {
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .stats-title {
          font-family: var(--font-eng);
          color: var(--color-accent);
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .stats-card {
          background: white;
          padding: 40px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          width: 100%;
          margin-bottom: 30px;
        }
        .stat-emoji {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: bounce 1s infinite alternate;
        }
        .stat-message {
          font-size: 2rem;
          color: var(--color-text);
          font-weight: bold;
          margin-bottom: 20px;
        }
        .stat-details {
          font-size: 1.2rem;
          color: #666;
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
            position: relative;
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
            position: relative; 
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
        
        .feedback-emoji {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8rem;
          pointer-events: none;
          animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 10;
        }
        .correct { color: var(--color-secondary); }
        .wrong { color: var(--color-danger); }

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
        .btn-option.correct {
            background: var(--color-secondary) !important;
            color: white !important;
            border-color: var(--color-secondary) !important;
        }
        .btn-option.wrong {
            background: var(--color-danger) !important;
            color: white !important;
            border-color: var(--color-danger) !important;
            animation: shake 0.4s;
        }

        @keyframes pop-in {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
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
