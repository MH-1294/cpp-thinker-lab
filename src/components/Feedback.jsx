import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "Sarah K.", rating: 5, comment: "This course is amazing! The scenarios really helped me understand C++ logic instead of just memorizing syntax." },
    { id: 2, name: "David L.", rating: 5, comment: "Dr. Abid explains things so clearly. The flashcards on this site were a lifesaver before the midterm!" },
    { id: 3, name: "Emily R.", rating: 4, comment: "Great resources! The simulated playground helped me figure out loops without setting up a full IDE." }
  ]);

  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('cs110_feedbacks');
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }
    
    const savedName = localStorage.getItem('cs110_username');
    if (savedName) setNewName(savedName);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    const newFeedback = {
      id: Date.now(),
      name: newName,
      rating: newRating,
      comment: newComment
    };

    const updatedFeedbacks = [newFeedback, ...feedbacks];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('cs110_feedbacks', JSON.stringify(updatedFeedbacks));
    
    setNewComment('');
    setIsSubmitted(true);
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">Student Feedback</span></h2>
        <p>Read what others are saying about the course, or leave your own anonymous/named review!</p>
      </div>

      <div className="feature-grid" style={{ marginTop: '0', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
            <MessageSquare size={24} /> Leave a Review
          </h3>
          
          {isSubmitted ? (
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.2)', color: 'var(--success-color)', borderRadius: '8px', textAlign: 'center' }}>
              Thank you for your feedback!
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name (or Anonymous)</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: 'white' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Your Comment</label>
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Submit Feedback</button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: '1', minWidth: '300px' }}>
          {feedbacks.map(fb => (
            <div key={fb.id} className="feature-card" style={{ padding: '1.5rem', marginTop: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--accent-color)' }}>{fb.name}</strong>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < fb.rating ? "#fbbf24" : "none"} color={i < fb.rating ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', fontStyle: 'italic' }}>"{fb.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
