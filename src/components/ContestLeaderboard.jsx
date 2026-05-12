import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Medal, Loader } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function ContestLeaderboard({ contestId, contestType }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      if (!db || !contestId) return;

      try {
        const q = query(
          collection(db, 'contest_submissions'),
          where('contestId', '==', contestId),
          where('status', '==', 'solved'),
          orderBy('timestamp', 'asc') // First person to solve gets higher rank if solve count is equal
        );
        const snap = await getDocs(q);
        
        const groupKey = contestType === 'group' ? 'teamName' : 'userId';
        const standingsMap = {};
        
        snap.docs.forEach(d => {
          const data = d.data();
          const key = data[groupKey] || (contestType === 'group' ? 'No Team' : data.userId);
          
          if (!standingsMap[key]) {
            standingsMap[key] = {
              name: contestType === 'group' ? key : data.userName,
              solvedCount: 0,
              lastSolveTime: 0
            };
          }
          standingsMap[key].solvedCount += 1;
          // In a real contest, time might be measured from contest start. 
          // Here we'll just track how many they solved.
          if (data.timestamp > standingsMap[key].lastSolveTime) {
            standingsMap[key].lastSolveTime = data.timestamp;
          }
        });

        const results = Object.values(standingsMap).sort((a, b) => {
          if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
          return a.lastSolveTime - b.lastSolveTime; // Penalty for later solves
        });

        setStandings(results);
      } catch (e) {
        console.error('Error fetching standings:', e);
      }
      setLoading(false);
    };

    fetchStandings();
  }, [contestId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Loader size={24} className="animate-spin" style={{ color: 'var(--accent-color)', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {standings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Medal size={48} style={{ opacity: 0.1, marginBottom: '1rem', margin: '0 auto' }} />
          <p>No submissions yet. Be the first to solve a problem!</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '50px 1fr 100px 100px', fontWeight: 'bold', fontSize: '0.85rem', color: '#94a3b8' }}>
            <span>Rank</span>
            <span>{contestType === 'group' ? 'Team Name' : 'Competitor'}</span>
            <span style={{ textAlign: 'center' }}>Solved</span>
            <span style={{ textAlign: 'right' }}>Score</span>
          </div>
          {standings.map((user, index) => (
            <div key={user.name} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'grid', gridTemplateColumns: '50px 1fr 100px 100px', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: index < 3 ? '#fbbf24' : '#64748b' }}>#{index + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {index === 0 && <Trophy size={16} color="#fbbf24" />}
                <span style={{ color: 'white', fontWeight: index < 3 ? 'bold' : 'normal' }}>{user.name}</span>
              </div>
              <span style={{ textAlign: 'center', color: 'var(--success-color)', fontWeight: 'bold' }}>{user.solvedCount}</span>
              <span style={{ textAlign: 'right', color: 'white', fontWeight: 'bold' }}>{user.solvedCount * 100}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
