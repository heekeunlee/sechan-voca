import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Result({ score, total, onHome }) {
    const percentage = (score / total) * 100;
    let stars = 1;
    if (percentage >= 100) stars = 3;
    else if (percentage >= 60) stars = 2;

    useEffect(() => {
        if (percentage >= 60) {
            const duration = 3000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [percentage]);

    return (
        <div className="result-container">
            <div className="stars">
                <span className={`star ${stars >= 1 ? 'active' : ''}`}>⭐</span>
                <span className={`star ${stars >= 2 ? 'active' : ''}`}>⭐</span>
                <span className={`star ${stars >= 3 ? 'active' : ''}`}>⭐</span>
            </div>

            <h1 className="score-text">
                {score} / {total}
            </h1>

            <p className="message">
                {stars === 3 ? "Perfect! You're a Genius! 🏆" :
                    stars === 2 ? "Great Job! Keep it up! 👍" :
                        "Good try! Practice more! 💪"}
            </p>

            <button className="btn-primary" onClick={onHome}>
                Play Again 🔄
            </button>

            <style>{`
        .result-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
        }
        .stars {
          font-size: 4rem;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }
        .star {
          opacity: 0.3;
          transform: scale(0.8);
          transition: all 0.5s;
        }
        .star.active {
          opacity: 1;
          transform: scale(1.1);
          animation: bounce 1s infinite alternate;
        }
        .score-text {
          font-size: 4rem;
          margin: 0;
          color: var(--color-accent);
          font-family: var(--font-eng);
        }
        .message {
          font-size: 1.5rem;
          color: var(--color-text);
          margin-bottom: 40px;
        }
        
        @keyframes bounce {
          from { transform: translateY(0) scale(1.1); }
          to { transform: translateY(-10px) scale(1.1); }
        }
        .star:nth-child(2) { animation-delay: 0.2s; }
        .star:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
        </div>
    );
}
