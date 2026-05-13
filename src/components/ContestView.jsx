import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Terminal, CheckCircle, ChevronLeft, Loader } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import ContestLeaderboard from './ContestLeaderboard';

export default function ContestView({ contest, onBack, onSolve, userId }) {
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState(() => localStorage.getItem(`team_${contest?.firestoreId}`) || '');
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('problems');

  useEffect(() => {
    if (contest.type === 'group' && teamName.trim()) {
      const fetchTeamSize = async () => {
        try {
          const q = query(collection(db, 'contest_submissions'), where('contestId', '==', contest.firestoreId), where('teamName', '==', teamName.trim()));
          const snap = await getDocs(q);
          const uniqueUsers = new Set(snap.docs.map(d => d.data().userId));
          setTeamMembersCount(uniqueUsers.size);
        } catch (e) { console.error(e); }
      };
      fetchTeamSize();
    }
  }, [teamName, contest]);

  useEffect(() => {
    const fetchContestData = async () => {
      setLoading(true);
      if (!db || !contest) return;

      try {
        // 1. Fetch Problems for this contest
        const problemPromises = contest.problemIds.map(pid => getDoc(doc(db, 'problems', pid)));
        const problemSnaps = await Promise.all(problemPromises);
        const fetchedProblems = problemSnaps
          .filter(s => s.exists())
          .map(s => ({ firestoreId: s.id, ...s.data() }));
        setProblems(fetchedProblems);

        // 2. Fetch User's solved status for this contest
        if (userId) {
          const subQ = query(
            collection(db, 'contest_submissions'), 
            where('contestId', '==', contest.firestoreId),
            where('userId', '==', userId),
            where('status', '==', 'solved')
          );
          const subSnap = await getDocs(subQ);
          setSolvedIds(subSnap.docs.map(d => d.data().problemId));
        }
      } catch (e) {
        console.error('Error fetching contest data:', e);
      }
      setLoading(false);
    };

    fetchContestData();
  }, [contest, userId]);

  const now = new Date();
  const isOngoing = now >= new Date(contest.startTime) && now <= new Date(contest.endTime);
  const hasEnded = now > new Date(contest.endTime);

  if (loading) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
        <Loader size={32} className="animate-spin" style={{ color: 'var(--accent-color)', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Loading contest details...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={onBack} className="btn btn-secondary mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
        <ChevronLeft size={18} /> Back to Contests
      </button>

      <div className="glass-panel mb-6" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="text-gradient mb-2" style={{ fontSize: '2rem' }}>{contest.title}</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                {contest.type || 'Individual'}
              </span>
              <p style={{ color: '#94a3b8', margin: 0 }}>{contest.description}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', minWidth: '150px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Clock size={14} /> {hasEnded ? 'Contest Ended' : 'Time Remaining'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isOngoing ? 'var(--success-color)' : 'white' }}>
              {hasEnded ? 'Finished' : 'Live Now'}
            </div>
          </div>
        </div>

        {contest.type === 'group' && (
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(56, 189, 248, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Team Participation</label>
              <input 
                type="text" 
                placeholder="Enter Team Name (e.g. Code Ninjas)" 
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  localStorage.setItem(`team_${contest.firestoreId}`, e.target.value);
                }}
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '200px' }}>
              Friends can join your team by using the <strong>same team name</strong>. 
              {contest.maxTeamSize && <div style={{ marginTop: '0.25rem', color: teamMembersCount >= contest.maxTeamSize ? '#f87171' : 'var(--success-color)' }}>Limit: {teamMembersCount}/{contest.maxTeamSize} members</div>}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={() => setActiveTab('problems')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'problems' ? 'var(--accent-color)' : '#94a3b8',
              borderBottom: activeTab === 'problems' ? '2px solid var(--accent-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Problems ({problems.length})
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'leaderboard' ? 'var(--accent-color)' : '#94a3b8',
              borderBottom: activeTab === 'leaderboard' ? '2px solid var(--accent-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeTab === 'problems' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {problems.map((problem, index) => {
            const isSolved = solvedIds.includes(problem.firestoreId);
            return (
              <div key={problem.firestoreId} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', border: isSolved ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isSolved ? 'var(--success-color)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSolved ? '#0f172a' : '#94a3b8', fontWeight: 'bold' }}>
                    {isSolved ? <CheckCircle size={20} /> : index + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: isSolved ? 'var(--success-color)' : 'white', margin: 0 }}>{problem.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>100 Points</span>
                  </div>
                </div>
                <button 
                  disabled={!isOngoing && !hasEnded && contest.status !== 'active'}
                  onClick={() => {
                    if (contest.type === 'group' && !teamName.trim()) {
                      alert("Please enter a Team Name to join this group contest!");
                      return;
                    }
                    if (contest.type === 'group' && contest.maxTeamSize && teamMembersCount >= contest.maxTeamSize && !solvedIds.length) {
                      // Only block if they haven't already solved anything (meaning they are trying to join a full team)
                      alert(`This team is full! Max ${contest.maxTeamSize} members allowed.`);
                      return;
                    }
                    onSolve(problem, contest.firestoreId, teamName);
                  }}
                  className={`btn ${isSolved ? 'btn-secondary' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                >
                  <Terminal size={16} /> {isSolved ? 'Review Solution' : 'Solve Problem'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <ContestLeaderboard contestId={contest.firestoreId} contestType={contest.type} />
      )}
    </div>
  );
}
