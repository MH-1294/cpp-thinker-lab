import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { Send, Cloud, Star } from 'lucide-react';

const COLORS = [
  '#38bdf8', '#fbbf24', '#a78bfa', '#34d399', '#f472b6', '#f87171', '#cbd5e1', '#818cf8'
];

// Hash function to consistently assign a color to a word
const getWordStyle = (word, count) => {
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = COLORS[hash % COLORS.length];
  
  // Logarithmic scale so highly requested items don't completely break the UI
  // Base 1.2rem, max 5rem
  const size = Math.min(1.2 + Math.log10(count) * 2, 5); 
  const delay = (hash % 10) * 0.5; // Random animation delay for the float effect

  return {
    color,
    fontSize: `${size}rem`,
    fontWeight: count > 3 ? 'bold' : 'normal',
    textShadow: count > 5 ? `0 0 15px ${color}80` : 'none',
    animationDelay: `${delay}s`,
    margin: `${Math.max(0.5, size * 0.2)}rem`, // Dynamic margin based on size
    display: 'inline-block',
    lineHeight: 1.2
  };
};

export default function WordCloudView() {
  const [words, setWords] = useState([]);
  const [inputWord, setInputWord] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!db) return;

    // Listen to all feature requests
    const q = query(collection(db, 'feature_requests'), orderBy('count', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedWords = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // We shuffle the words array visually so the biggest ones aren't always just in the center/top
      // using a deterministic shuffle based on length so it doesn't jump wildly on every update
      const sorted = [...fetchedWords].sort((a, b) => {
        const hashA = a.word.charCodeAt(0);
        const hashB = b.word.charCodeAt(0);
        return hashA - hashB;
      });
      
      setWords(sorted);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    let trimmed = inputWord.trim();
    if (!trimmed) return;

    if (trimmed.length > 30) {
      setErrorMessage("Please keep ideas short and sweet (under 30 characters)!");
      return;
    }

    setIsSubmitting(true);
    
    // Normalize string: lowercase and remove excessive spaces
    const normalizedWord = trimmed.toLowerCase().replace(/\s+/g, ' ');
    const displayWord = trimmed; // Keep original casing for display if it's new

    try {
      // Check if word already exists (case insensitive match via our normalized string, but we rely on exact match for simplicity)
      // Since Firestore doesn't support easy case-insensitive queries, we query all and filter client side
      const existingMatch = words.find(w => w.word.toLowerCase() === normalizedWord);

      if (existingMatch) {
        // Increment count
        await updateDoc(doc(db, 'feature_requests', existingMatch.id), {
          count: existingMatch.count + 1,
          lastUpdated: Date.now()
        });
      } else {
        // Add new word
        await addDoc(collection(db, 'feature_requests'), {
          word: displayWord,
          count: 1,
          createdAt: Date.now(),
          lastUpdated: Date.now()
        });
      }
      
      setInputWord('');
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to submit. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '80vh', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="text-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', fontSize: '3rem', marginBottom: '0.5rem' }}>
          <Cloud size={48} /> Feature Wishlist
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          What do you want to see next on C++ Thinker Lab? Submit your ideas below! The more people request a feature, the bigger it grows in the cloud.
        </p>
      </div>

      {/* Cloud Container */}
      <div 
        className="glass-panel" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignContent: 'center', 
          justifyContent: 'center', 
          padding: '3rem',
          minHeight: '400px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
        }}
      >
        {words.length === 0 ? (
          <div style={{ color: '#64748b', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Star size={32} />
            The cloud is empty! Be the first to suggest a feature.
          </div>
        ) : (
          words.map((w) => (
            <span 
              key={w.id} 
              className="word-cloud-item"
              style={getWordStyle(w.word, w.count)}
              title={`${w.word}: Requested ${w.count} times`}
            >
              {w.word}
            </span>
          ))
        )}
      </div>

      {/* Submission Form */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="e.g. Dark Mode, Python Course, Leaderboard..."
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            disabled={isSubmitting}
            maxLength={30}
            style={{ 
              flex: 1, 
              padding: '1rem 1.5rem', 
              borderRadius: '30px', 
              border: '1px solid rgba(56,189,248,0.3)', 
              background: 'rgba(0,0,0,0.4)', 
              color: 'white',
              fontSize: '1.1rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !inputWord.trim()}
            className="btn"
            style={{ 
              borderRadius: '30px', 
              padding: '0 2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: (!inputWord.trim() || isSubmitting) ? 0.6 : 1,
              background: 'var(--accent-color)',
              color: '#0f172a',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            {isSubmitting ? 'Sending...' : <><Send size={20} /> Add to Cloud</>}
          </button>
        </form>
        {errorMessage && (
          <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>{errorMessage}</p>
        )}
      </div>

    </div>
  );
}
