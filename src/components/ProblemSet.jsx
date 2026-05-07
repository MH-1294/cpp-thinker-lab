import React, { useState, useEffect } from 'react';
import { problems } from '../data/problems';
import { Terminal } from 'lucide-react';

export default function ProblemSet({ onSolve }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [allProblems, setAllProblems] = useState(problems);

  useEffect(() => {
    const savedCustom = localStorage.getItem('cs110_custom_problems');
    if (savedCustom) {
      try {
        const customP = JSON.parse(savedCustom);
        if (Array.isArray(customP) && customP.length > 0) {
          const safeProblems = Array.isArray(problems) ? problems : [];
          setAllProblems([...safeProblems, ...customP]);
        }
      } catch (e) {
        console.error("Error loading custom problems", e);
      }
    }
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">Problem Set</span></h2>
        <p>Challenge yourself with these classic competitive programming scenarios. Click a problem to expand it!</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {allProblems.map((problem, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div key={problem.id} style={{ marginBottom: '0.5rem' }}>
              <div 
                className={`accordion-header ${isActive ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0', color: isActive ? 'var(--accent-color)' : 'white' }}>
                    {problem.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Source: {problem.source}</span>
                </div>
                <div style={{ color: '#94a3b8', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  ▼
                </div>
              </div>

              {isActive && (
                <div className="accordion-content animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button className="btn btn-secondary" onClick={onSolve} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      <Terminal size={14} /> Solve in Playground
                    </button>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ color: '#e2e8f0', lineHeight: '1.7' }}>{problem.description}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Input Format</h4>
                      <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{problem.input}</p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Output Format</h4>
                      <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{problem.output}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Sample Input</h4>
                      <pre style={{ margin: '0', padding: '0.75rem', background: '#0f172a', border: '1px solid #1e293b', fontSize: '0.85rem' }}>
                        <code>{problem.sampleInput}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Sample Output</h4>
                      <pre style={{ margin: '0', padding: '0.75rem', background: '#0f172a', border: '1px solid #1e293b', fontSize: '0.85rem' }}>
                        <code>{problem.sampleOutput}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
