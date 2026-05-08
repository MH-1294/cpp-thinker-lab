import React, { useState, useEffect } from 'react';
import { Terminal, EyeOff } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { problems as staticProblems } from '../data/problems';

const isAdmin = (role) => ['superadmin', 'quiz_manager'].includes(role);

export default function ProblemSet({ onSolve, userRole }) {
  const [allProblems, setAllProblems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      if (!db) {
        // Fallback to static + localStorage problems
        const savedCustom = localStorage.getItem('cs110_custom_problems');
        let merged = [...staticProblems];
        if (savedCustom) {
          try { merged = [...merged, ...JSON.parse(savedCustom)]; } catch (e) {}
        }
        setAllProblems(merged.map(p => ({ ...p, isVisible: true })));
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'problems'), orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
        setAllProblems(fetched.length > 0 ? fetched : staticProblems.map(p => ({ ...p, isVisible: true })));
      } catch (e) {
        console.error('Error fetching problems:', e);
        setAllProblems(staticProblems.map(p => ({ ...p, isVisible: true })));
      }
      setLoading(false);
    };

    fetchProblems();
  }, []);

  const visibleProblems = isAdmin(userRole)
    ? allProblems
    : allProblems.filter(p => p.isVisible !== false);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">Problem Set</span></h2>
        <p>Challenge yourself with these classic competitive programming scenarios. Click a problem to expand it!</p>
        {isAdmin(userRole) && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#fbbf24' }}>
            👁 Admin View — Hidden problems are visible to you but not to students.
          </p>
        )}
      </div>

      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#94a3b8' }}>Loading problems...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          {visibleProblems.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
              No problems are available yet. Check back soon!
            </p>
          ) : (
            visibleProblems.map((problem, index) => {
              const isActive = activeIndex === index;
              const isHidden = problem.isVisible === false;

              return (
                <div key={problem.firestoreId || problem.id} style={{ marginBottom: '0.5rem', opacity: isHidden ? 0.55 : 1 }}>
                  <div
                    className={`accordion-header ${isActive ? 'active' : ''}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: '0', color: isActive ? 'var(--accent-color)' : 'white' }}>
                          {problem.title}
                        </h3>
                        {isHidden && isAdmin(userRole) && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '0.15rem 0.5rem', borderRadius: '20px', border: '1px solid rgba(248,113,113,0.3)' }}>
                            <EyeOff size={12} /> Hidden
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Source: {problem.source}</span>
                    </div>
                    <div style={{ color: '#94a3b8', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</div>
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
            })
          )}
        </div>
      )}
    </div>
  );
}
