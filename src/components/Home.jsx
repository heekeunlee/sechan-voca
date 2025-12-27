import { vocabularyData } from '../data/vocabulary';

export default function Home({ onSelectDay }) {
    const days = Object.keys(vocabularyData);

    return (
        <div className="home-container">
            <h1 className="title">
                English Voca<br />Adventure 🚀
            </h1>

            <div className="day-grid">
                {days.map((day) => (
                    <button
                        key={day}
                        className="day-card"
                        onClick={() => onSelectDay(day)}
                    >
                        <span className="day-title">{day}</span>
                        <span className="star-icon">⭐</span>
                    </button>
                ))}
            </div>

            <style>{`
        .home-container {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .day-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          width: 100%;
          max-width: 400px;
        }
        .day-card {
          background: white;
          border-bottom: 5px solid #eee;
          padding: 20px;
          border-radius: var(--radius-lg);
          font-size: 1.5rem;
          color: var(--color-text);
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .day-card:active {
          border-bottom: 0;
          transform: translateY(5px);
        }
        .day-title {
          font-family: var(--font-eng);
          font-weight: 700;
          color: var(--color-accent);
        }
      `}</style>
        </div>
    );
}
