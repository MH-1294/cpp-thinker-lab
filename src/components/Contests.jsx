import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Calendar, ChevronRight, Loader } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function Contests({ onViewContest }) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'contests'), orderBy('startTime', 'desc'));
        const snap = await getDocs(q);
        setContests(snap.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
      } catch (e) {
        console.error('Error fetching contests:', e);
      }
      setLoading(false);
    };

    fetchContests();
  }, []);

  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return { label: 'Upcoming', color: '#fbbf24', icon: <Calendar size={14} /> };
    if (now > end) return { label: 'Ended', color: '#94a3b8', icon: <Clock size={14} /> };
    return { label: 'Ongoing', color: '#10b981', icon: <Clock size={14} /> };
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">Contests & Competitions</span></h2>
        <p>Challenge your peers, solve problems in real-time, and climb the leaderboard!</p>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader size={32} className="animate-spin" style={{ color: 'var(--accent-color)', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Loading contests...</p>
        </div>
      ) : contests.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          <Trophy size={48} style={{ opacity: 0.1, marginBottom: '1rem', margin: '0 auto' }} />
          <p>No contests are currently scheduled. Check back later!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {contests.map(contest => {
            const status = getStatus(contest.startTime, contest.endTime);
            const isOngoing = status.label === 'Ongoing';

            return (
              <div key={contest.firestoreId} className="glass-panel h-full" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', border: isOngoing ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: `${status.color}15`, color: status.color, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {status.icon} {status.label}
                  </div>
                  <Trophy size={20} style={{ color: isOngoing ? '#fbbf24' : '#64748b', opacity: 0.5 }} />
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>{contest.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', flex: 1, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  {contest.description || 'No description provided.'}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                    <span>Starts:</span>
                    <span>{new Date(contest.startTime).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <span>Duration:</span>
                    <span>{Math.round((new Date(contest.endTime) - new Date(contest.startTime)) / (1000 * 60 * 60))} Hours</span>
                  </div>
                </div>

                <button 
                  onClick={() => onViewContest(contest)}
                  className={`btn ${isOngoing ? '' : 'btn-secondary'}`}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isOngoing ? 'Join Contest' : 'View Details'} <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
