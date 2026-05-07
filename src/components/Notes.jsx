import React, { useState, useEffect } from 'react';
import { Save, FileText, Trash2 } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('cs110_notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cs110_notes', notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your notes?")) {
      setNotes('');
      localStorage.removeItem('cs110_notes');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">My Study Notes</span></h2>
        <p>Jot down important concepts, code snippets, or reminders here. Your notes are saved locally in your browser!</p>
      </div>

      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
            <FileText size={20} /> Personal Scratchpad
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleClear} 
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
            >
              <Trash2 size={16} /> Clear
            </button>
            <button 
              onClick={handleSave} 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: isSaved ? 'var(--success-color)' : 'var(--accent-color)' }}
            >
              <Save size={16} /> {isSaved ? 'Saved!' : 'Save Notes'}
            </button>
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start typing your notes here..."
          style={{
            width: '100%',
            minHeight: '400px',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '1rem',
            lineHeight: '1.6',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>
    </div>
  );
}
