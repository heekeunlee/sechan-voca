import { useState, useEffect, useMemo } from 'react';
import { vocabularyData } from '../data/vocabulary';

// Utility to shuffle array
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Quiz({ day, onFinish }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null); // true, false, or null
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize questions
    useEffect(() => {
        const words = vocabularyData[day];
        if (!words) return;

        // Create question set: 10 random questions or all? Let's do all 20.
        // For each word, generate 3 wrong answers
        const quizSet = words.map(target => {
            // Get 3 random words excluding target
            const others = words.filter(w => w.id !== target.id);
            const distractors = shuffle(others).slice(0, 3);
            const options = shuffle([target, ...distractors]);
            return {
                target,
                options
            };
        });

        setQuestions(shuffle(quizSet));
    }, [day]);

    const handleOptionClick = (option) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setSelectedOption(option);

        const currentQ = questions[currentIndex];
        const correct = option.id === currentQ.target.id;

        setIsCorrect(correct);
        if (correct) {
            // Play Correct Sound (placeholder)
            setScore(s => s + 1);
        } else {
            // Play Wrong Sound (placeholder)
        }

        // Wait and go next
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
                setIsProcessing(false);
            } else {
                // Finish
                // Need to calculate final score before calling onFinish? 
                // score state update might lag slightly if checked immediately, but here we can pass (score + (correct?1:0))
                // Actually setScore updates via function, so let's calculate exact final score to pass.
                // Wait, 'score' variable in closures might be stale.
                // Better: calculate track locally or trust state update on next render?
                // Simpler: Just pass `score + (correct ? 1 : 0)` or create a ref.
                // Let's passed updated value.
                onFinish(score + (correct ? 1 : 0), questions.length);
            }
        }, 1500); // 1.5s delay to see feedback
    };

    if (questions.length === 0) return <div>Loading...</div>;

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="question-count">Q. {currentIndex + 1}</div>
            </div>

            <div className="quiz-card">
                <span className="quiz-word">{currentQ.target.word}</span>
                {isCorrect === true && <div className="feedback correct">⭕</div>}
                {isCorrect === false && <div className="feedback wrong">❌</div>}
            </div>

            <div className="options-grid">
                {currentQ.options.map((opt, idx) => {
                    let btnClass = "btn-option";
                    if (selectedOption) {
                        if (opt.id === currentQ.target.id) btnClass += " correct-answer"; // Always show correct answer
                        else if (opt === selectedOption) btnClass += " wrong-selection";
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
        .quiz-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        .quiz-header {
          margin-bottom: 20px;
        }
        .progress-bar {
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-fill {
          height: 100%;
          background: var(--color-secondary);
          transition: width 0.3s;
        }
        .question-count {
          text-align: right;
          font-weight: bold;
          color: #999;
        }
        .quiz-card {
          background: white;
          padding: 40px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          text-align: center;
          margin-bottom: 30px;
          position: relative;
          min-height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .quiz-word {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-accent);
          font-family: var(--font-eng);
        }
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .btn-option {
          background: white;
          border: 2px solid #eee;
          padding: 20px;
          border-radius: var(--radius-md);
          font-size: 1.2rem;
          color: var(--color-text);
          box-shadow: 0 4px 0 rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        .btn-option:active {
          transform: scale(0.98);
        }
        .correct-answer {
          background: var(--color-secondary) !important;
          color: white !important;
          border-color: var(--color-secondary) !important;
        }
        .wrong-selection {
          background: var(--color-danger) !important;
          color: white !important;
          border-color: var(--color-danger) !important;
          animation: shake 0.5s;
        }
        
        .feedback {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8rem;
          opacity: 0;
          animation: pop-in 0.5s forwards;
          pointer-events: none;
        }
        .feedback.correct { color: var(--color-secondary); }
        .feedback.wrong { color: var(--color-danger); }

        @keyframes pop-in {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
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
