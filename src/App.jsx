import { useState, useEffect, useRef } from 'react'
import './App.css'
import Home from './components/Home'
import Study from './components/Study'
import Quiz from './components/Quiz'
import Result from './components/Result'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentDay, setCurrentDay] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Attempt to play audio on mount, might be blocked
    const playAudio = async () => {
      if (audioRef.current && !isMuted) {
        try {
          await audioRef.current.play();
        } catch (e) {
          console.log("Autoplay blocked, waiting for interaction");
        }
      }
    };
    playAudio();

    // Add global click listener to enable audio on first interaction
    const handleInteraction = () => {
      if (!hasInteracted.current && audioRef.current && !isMuted) {
        audioRef.current.play().catch(e => console.log("Play failed", e));
        hasInteracted.current = true;
      }
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [isMuted]);

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent triggering the global interaction handler redundantly
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        hasInteracted.current = true;
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const startStudy = (day) => {
    setCurrentDay(day);
    setCurrentPage('study');
  };

  const startQuiz = (day) => {
    setCurrentDay(day);
    setCurrentPage('quiz');
  };

  const finishQuiz = (score, total) => {
    setQuizScore(score);
    setTotalQuestions(total);
    setCurrentPage('result');
  };

  const goHome = () => {
    setCurrentPage('home');
    setCurrentDay(null);
    setQuizScore(null);
  };

  // BGM Path - absolute path based on repo name for GitHub Pages
  const bgmPath = "/sechan-voca/bgm.mp3";

  return (
    <>
      <audio ref={audioRef} src={bgmPath} loop volume="0.3" />

      <button className="bgm-toggle" onClick={toggleMute}>
        {isMuted ? '🔇' : '🎵'}
      </button>

      <div className="app-container">
        {currentPage === 'home' && (
          <Home onSelectDay={startStudy} />
        )}
        {currentPage === 'study' && (
          <Study
            day={currentDay}
            onFinish={() => startQuiz(currentDay)}
            onBack={goHome}
          />
        )}
        {currentPage === 'quiz' && (
          <Quiz
            day={currentDay}
            onFinish={finishQuiz}
            onBack={goHome}
          />
        )}
        {currentPage === 'result' && (
          <Result
            score={quizScore}
            total={totalQuestions}
            onRestart={goHome}
          />
        )}
      </div>
    </>
  )
}

export default App
