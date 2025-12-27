import { useState } from 'react';
import Home from './components/Home';
import Study from './components/Study';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  const [view, setView] = useState('home'); // home, study, quiz, result
  const [currentDay, setCurrentDay] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const startStudy = (day) => {
    setCurrentDay(day);
    setView('study');
  };

  const startQuiz = () => {
    setView('quiz');
  };

  const finishQuiz = (finalScore, total) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setView('result');
  };

  const goHome = () => {
    setView('home');
    setCurrentDay(null);
    setScore(0);
  };

  return (
    <div className="app">
      {view === 'home' && <Home onSelectDay={startStudy} />}
      {view === 'study' && (
        <Study
          day={currentDay}
          onFinish={startQuiz}
          onBack={goHome}
        />
      )}
      {view === 'quiz' && (
        <Quiz
          day={currentDay}
          onFinish={finishQuiz}
        />
      )}
      {view === 'result' && (
        <Result
          score={score}
          total={totalQuestions}
          onHome={goHome}
        />
      )}
    </div>
  );
}

export default App;
