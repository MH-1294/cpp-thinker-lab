import React, { useState, useEffect } from 'react';
import { PlayCircle, Lock, CheckCircle, Clock } from 'lucide-react';

const DEFAULT_LESSONS = [
  { id: 1, title: "1. Introduction to C++", duration: "12:45", completed: true, locked: false },
  { id: 2, title: "2. Setting up the Environment", duration: "08:20", completed: true, locked: false },
  { id: 3, title: "3. Variables & Data Types", duration: "15:30", completed: false, locked: false },
  { id: 4, title: "4. Control Flow (If/Else)", duration: "22:15", completed: false, locked: true },
  { id: 5, title: "5. Loops (For, While, Do-While)", duration: "18:40", completed: false, locked: true },
  { id: 6, title: "6. Functions & Scope", duration: "25:10", completed: false, locked: true },
  { id: 7, title: "7. Arrays & Vectors", duration: "20:05", completed: false, locked: true },
  { id: 8, title: "8. Pointers & Memory Management", duration: "35:00", completed: false, locked: true },
];

export default function Course({ isAuthenticated, onRequireAuth }) {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [lessons, setLessons] = useState(DEFAULT_LESSONS);
  const [activeLesson, setActiveLesson] = useState(DEFAULT_LESSONS[0]);

  useEffect(() => {
    const isUnlocked = localStorage.getItem('cs110_course_unlocked') === 'true';
    if (isUnlocked) setHasPurchased(true);

    const saved = localStorage.getItem('cs110_custom_course');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const fullCourse = [...DEFAULT_LESSONS, ...parsed];
          setLessons(fullCourse);
        }
      } catch (e) {}
    }
  }, []);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      alert("Please log in or create an account to purchase the course.");
      if (onRequireAuth) onRequireAuth();
      return;
    }

    alert("Redirecting to Stripe Secure Checkout...");
    setTimeout(() => {
      setHasPurchased(true);
      localStorage.setItem('cs110_course_unlocked', 'true');
      alert("Payment Successful! Premium Course Unlocked.");
    }, 1000);
  };

  const renderVideoArea = () => {
    if (!hasPurchased && activeLesson.locked) {
      return (
        <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--accent-color)' }}>
          <Lock size={48} color="var(--accent-color)" style={{ marginBottom: '1.5rem' }} />
          <h2 className="text-gradient mb-4" style={{ fontSize: '2rem' }}>Premium Lesson Locked</h2>
          <p className="mb-4" style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            You've reached a premium lesson. Unlock the complete C++ course to access all 40+ hours of advanced video tutorials.
          </p>
          
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1.5rem', maxWidth: '350px', margin: '0 auto 1.5rem auto' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>One-Time Payment</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>
              $19<span style={{ fontSize: '1rem', color: '#94a3b8' }}>.00 <span style={{fontSize: '0.8rem'}}>CAD</span></span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>+ applicable taxes</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', textAlign: 'left', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={14} color="var(--success-color)" /> Lifelong Video Course Access</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={14} color="var(--success-color)" /> Exclusive Problem Sets</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={14} color="var(--success-color)" /> Certificate of Completion</li>
            </ul>
            <button onClick={handlePurchase} className="btn" style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}>
              Unlock Full Course
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #0f172a, #1e293b)' }}>
          <PlayCircle size={64} color="var(--accent-color)" style={{ cursor: 'pointer', opacity: 0.8 }} />
          <p style={{ marginTop: '1rem', color: '#cbd5e1' }}>Free Preview Playing: {activeLesson.title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Video Player Area */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          {renderVideoArea()}
          
          <div style={{ marginTop: '1.5rem', padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem' }}>{activeLesson.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {activeLesson.duration}</span>
              <span>Instructor: Dm. Mehedi Hasan Abid</span>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
              In this lesson, we will dive deep into {activeLesson.title.split('. ')[1]}. You will learn the core concepts, common pitfalls, and how to apply these techniques in competitive programming scenarios.
            </p>
          </div>
        </div>

        {/* Lesson List */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 150px)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0, color: 'white' }}>Course Content</h3>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Free preview available</div>
          </div>
          
          <div style={{ overflowY: 'auto', padding: '0.5rem' }}>
            {lessons.map(lesson => (
              <button 
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '1rem', 
                  background: activeLesson.id === lesson.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  color: 'white',
                  marginBottom: '0.25rem'
                }}
                className={activeLesson.id !== lesson.id ? "hover-highlight" : ""}
              >
                {lesson.completed ? (
                  <CheckCircle size={20} color="var(--success-color)" style={{ flexShrink: 0 }} />
                ) : !hasPurchased && lesson.locked ? (
                  <Lock size={20} color="#64748b" style={{ flexShrink: 0 }} />
                ) : (
                  <PlayCircle size={20} color={activeLesson.id === lesson.id ? "var(--accent-color)" : "#64748b"} style={{ flexShrink: 0 }} />
                )}
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem', color: !hasPurchased && lesson.locked ? '#94a3b8' : 'white' }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{lesson.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
