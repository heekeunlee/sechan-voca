import { useState, useEffect } from 'react';
import { vocabularyData } from '../data/vocabulary';

export default function Study({ day, onFinish, onBack }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const words = vocabularyData[day] || [];
    const currentWord = words[currentIndex];

    const playAudio = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Slightly slower for kids
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (currentWord && !isFlipped) {
            playAudio(currentWord.word);
        }
    }, [currentIndex, currentWord]);

    const handleNext = (e) => {
        e.stopPropagation();
        if (currentIndex < words.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        } else {
            onFinish();
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
        }
    };

    const toggleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div className="study-container">
            <div className="header">
                <button className="btn-icon" onClick={onBack}>⬅️</button>
                <h2>Study {day}</h2>
                <span className="counter">{currentIndex + 1} / {words.length}</span>
            </div>

            <div className="card-area" onClick={toggleFlip}>
                <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                    <div className="card-face front">
                        <span className="word-text">{currentWord?.word}</span>
                        <button
                            className="btn-audio"
                            onClick={(e) => {
                                e.stopPropagation();
                                playAudio(currentWord?.word);
                            }}
                        >
                            🔊
                        </button>
                        <div className="hint">Tap to flip</div>
                    </div>
                    <div className="card-face back">
                        <span className="meaning-text">{currentWord?.meaning}</span>
                        <span className="small-word">{currentWord?.word}</span>
                    </div>
                </div>
            </div>

            <div className="controls">
                <button
                    className="btn-nav"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    PREV
                </button>
                <button
                    className="btn-nav primary" // Changed to primary class only here
                    onClick={handleNext}
                >
                    {currentIndex === words.length - 1 ? 'START QUIZ 🚀' : 'NEXT'}
                </button>
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
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .counter {
          font-weight: bold;
          color: var(--color-text);
        }
        .btn-icon {
          background: none;
          font-size: 1.5rem;
        }
        .card-area {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          cursor: pointer;
        }
        .card {
          width: 100%;
          max-width: 320px;
          height: 400px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }
        .card.flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-lg);
          backface-visibility: hidden;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .front {
          background: linear-gradient(135deg, white, #fffdf5);
        }
        .back {
          background: linear-gradient(135deg, var(--color-bg), white);
          transform: rotateY(180deg);
        }
        .word-text {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-accent);
          font-family: var(--font-eng);
        }
        .meaning-text {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .small-word {
          margin-top: 10px;
          font-size: 1.2rem;
          color: #999;
          font-family: var(--font-eng);
        }
        .hint {
          font-size: 0.9rem;
          color: #aaa;
          margin-top: 20px;
        }
        .btn-audio {
          background: var(--color-primary);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          margin-top: 20px;
          box-shadow: 0 4px 0 rgba(0,0,0,0.1);
        }
        .btn-audio:active {
          transform: scale(0.9);
          box-shadow: none;
        }
        .controls {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }
        .btn-nav {
          flex: 1;
          padding: 15px;
          border-radius: var(--radius-lg);
          font-size: 1.2rem;
          font-weight: bold;
          background: white;
          color: var(--color-text);
          box-shadow: var(--shadow-btn);
        }
        .btn-nav.primary {
          background: var(--color-secondary);
          color: white;
        }
        .btn-nav:disabled {
          opacity: 0.5;
          box-shadow: none;
          transform: none;
        }
      `}</style>
        </div>
    );
}
