import React, { useEffect, useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const getBadge = (score, total) => {
  if (score === total) return 'C++ Wizard';
  if (score >= total * 0.8) return 'Syntax Master';
  if (score >= total * 0.6) return 'Logic Thinker';
  if (score >= total * 0.4) return 'Loop Guru';
  return 'Bug Hunter';
};

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      if (!db) {
        // Fallback: read from localStorage
        const savedData = localStorage.getItem('cs110_leaderboard');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed)) {
              const entries = parsed.map((entry, i) => ({
                id: 'local_' + i,
                name: entry.name || 'Anonymous',
                score: entry.score || 0,
                total: entry.total || 5,
                timeTaken: entry.timeTaken || 999,
                badge: getBadge(entry.score, entry.total || 5),
              }));
              setStudents(entries);
            }
          } catch (e) {}
        }
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
        const snap = await getDocs(q);
        const entries = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (entries.length > 0) {
          setStudents(entries);
        } else {
          // No data yet — show an empty state, not fake data
          setStudents([]);
        }
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
        setStudents([]);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const sorted = [...students].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.timeTaken || 999) - (b.timeTaken || 999);
  });

  const formatTime = (seconds) => {
    if (!seconds || seconds === 999) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const medalColor = (i) => {
    if (i === 0) return '#fbbf24';
    if (i === 1) return '#cbd5e1';
    if (i === 2) return '#b45309';
    return 'var(--accent-color)';
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="text-gradient mb-2 text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Trophy size={28} /> <span className="ali-highlight">Class Leaderboard</span>
      </h2>
      <p className="text-center mb-4">Ranked by Score, then by Fastest Time.</p>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading scores...</p>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Trophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No scores yet!</p>
          <p style={{ fontSize: '0.9rem' }}>Be the first to complete a quiz and claim the #1 spot.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sorted.map((student, index) => (
            <div
              key={student.id}
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
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: medalColor(index), width: '30px' }}>
                  #{index + 1}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: student.isCurrent ? 'bold' : 'normal', color: 'white' }}>
                  {student.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                  {student.badge || getBadge(student.score, student.total || 5)}
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
      )}
    </div>
  );
}
