import { BrainCircuit, CheckSquare, Sparkles } from 'lucide-react';

export default function Hero({ onStartQuiz, onStartGuide }) {
  return (
    <div className="hero animate-fade-in">
      <h1>C++ Thinker Lab</h1>
      <p>
        Master C++ through <span className="ali-highlight">interactive problem-solving</span>. Whether you are a complete beginner 
        or looking to test your knowledge based on Y. Daniel Liang's comprehensive text, 
        you are in the right place.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button className="btn" onClick={onStartGuide}>
          New to Programming? Start Here
        </button>
        <button className="btn btn-secondary" onClick={onStartQuiz}>
          Take the C++ Assessment
        </button>
      </div>

      <div className="feature-grid">
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BrainCircuit size={48} color="var(--accent-color)" className="mb-2" />
          <h3 className="ali-highlight">Scenario-Based</h3>
          <p style={{ marginTop: '1rem' }}>Solve real-world engineering problems.</p>
        </div>
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <CheckSquare size={48} color="var(--accent-color)" className="mb-2" />
          <h3 className="ali-highlight">Interactive MCQs</h3>
          <p style={{ marginTop: '1rem' }}>Test syntax & logic with instant feedback.</p>
        </div>
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Sparkles size={48} color="var(--accent-color)" className="mb-2" />
          <h3 className="ali-highlight">Beginner Friendly</h3>
          <p style={{ marginTop: '1rem' }}>Zero experience needed. Start from scratch.</p>
        </div>
      </div>
    </div>
  );
}
