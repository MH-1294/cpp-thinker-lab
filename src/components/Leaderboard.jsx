import React, { useEffect, useState } from 'react';
import { Trophy, Clock } from 'lucide-react';

// Mock data to simulate other students
const mockStudents = [
  { id: 1, name: "Alice J.", score: 5, timeTaken: 45, badge: "Syntax Master" },
  { id: 2, name: "Bob M.", score: 4, timeTaken: 60, badge: "Loop Guru" },
  { id: 3, name: "Charlie T.", score: 3, timeTaken: 120, badge: "Bug Hunter" },
];

export default function Leaderboard() {
  const [allStudents, setAllStudents] = useState(mockStudents);

  useEffect(() => {
    // Read the dynamic leaderboard array from localStorage
    const savedData = localStorage.getItem('cs110_leaderboard');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          // Map to match structure and add isCurrent flag
          const currentAttempts = parsed.map((entry, index) => {
            let badge = "Learner";
            if (entry.score === entry.total) badge = "C++ Wizard";
            else if (entry.score >= entry.total / 2) badge = "Logic Thinker";

            return {
              id: 'current_' + index,
              name: entry.name || 'Anonymous',
              score: entry.score,
              timeTaken: entry.timeTaken || 999, // default if missing
              badge: badge,
              isCurrent: true,
              date: entry.date
            };
          });

          // Only keep the best attempt per unique name from the current user data?
          // Or just show all? The prompt says "leaderboard need to updated based on the attempt". Let's show all for now, or just the best. Let's show all attempts.
          
          setAllStudents([...mockStudents, ...currentAttempts]);
        }
      } catch (e) {}
    }
  }, []);

  // Sort by score descending, then time ascending
  const sortedStudents = [...allStudents].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeTaken - b.timeTaken;
  });

  const formatTime = (seconds) => {
    if (seconds === 999) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="text-gradient mb-2 text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Trophy size={28} /> <span className="ali-highlight">Class Leaderboard</span>
      </h2>
      <p className="text-center mb-4">Ranked by Score, and then by Fastest Time.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {sortedStudents.map((student, index) => (
          <div 
            key={student.id} 
            className={`leaderboard-row ${student.isCurrent ? 'current-user' : ''}`}
            style={{ 
              background: student.isCurrent ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.2)',
              border: student.isCurrent ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#b45309' : 'var(--accent-color)', width: '30px' }}>
                #{index + 1}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: student.isCurrent ? 'bold' : 'normal', color: 'white' }}>
                {student.name}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                {student.badge}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', width: '70px' }}>
                <Clock size={14} /> {formatTime(student.timeTaken)}
              </div>
              <span style={{ fontWeight: 'bold', color: 'var(--success-color)', fontSize: '1.1rem', width: '60px', textAlign: 'right' }}>
                {student.score} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
