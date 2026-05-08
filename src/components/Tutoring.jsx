import React, { useState } from 'react';
import { Calendar, Clock, Video, UserCheck } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Tutoring({ isAuthenticated, userName }) {
  const [topic, setTopic] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isAuthenticated) {
      setError("Please sign in to book a tutoring session.");
      return;
    }

    if (!db) {
      setIsSubmitted(true);
      setTopic('');
      setUrgency('Medium');
      setPreferredTime('');
      setMessage('');
      return;
    }

    try {
      await addDoc(collection(db, "tutoring_requests"), {
        studentName: userName,
        topic,
        urgency,
        preferredTime,
        message,
        timestamp: Date.now(),
        status: 'Pending'
      });
      
      setIsSubmitted(true);
      setTopic('');
      setUrgency('Medium');
      setPreferredTime('');
      setMessage('');
      
    } catch (err) {
      console.error("Error submitting request: ", err);
      // Fallback for UI if Firebase fails
      if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        setIsSubmitted(true);
      } else {
        setError("Failed to submit request. Please try again.");
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">1-on-1 Tutoring</span></h2>
        <p>Stuck on a tricky C++ concept? Book a personalized session to get unblocked fast.</p>
      </div>

      <div className="feature-grid" style={{ marginTop: '0', gridTemplateColumns: '1fr 1fr' }}>
        {/* Left Side: Info */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent-color)' }}>Why Book a Session?</h3>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Personalized Guidance</h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>We'll focus exactly on where you are stuck, whether it's pointers, classes, or debugging.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <Video size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Live Pair Programming</h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Share your screen and we'll write and debug code together in real-time over Zoom.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <Clock size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Flexible Scheduling</h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Sessions are typically 30 or 60 minutes long. Let me know what time works best for you.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass-panel">
          <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
            <Calendar size={24} /> Request a Session
          </h3>

          {!isAuthenticated ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <UserCheck size={48} color="#475569" style={{ margin: '0 auto 1rem auto' }} />
              <p className="mb-4 text-gray-400">You need to be signed in to request a tutoring session.</p>
              <button className="btn" disabled style={{ opacity: 0.5 }}>Sign in to Book</button>
            </div>
          ) : isSubmitted ? (
            <div style={{ padding: '2rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: 'var(--success-color)', borderRadius: '12px', textAlign: 'center' }}>
              <h4 className="mb-2" style={{ fontSize: '1.2rem' }}>Request Saved! 🎉</h4>
              <p className="mb-4">To finalize your booking, please complete the payment securely via Stripe below. Once paid, I'll send you the meeting invite!</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                <stripe-buy-button
                  buy-button-id="buy_btn_1TUft6Ihqoa2gym0dxyhQnH9"
                  publishable-key="pk_live_51PsVkEIhqoa2gym0ZQzQDWC8QqBCXDvYKWwDt03w1odz2TJKirE5D7Wb7TaWoafGW7mozyoQSSxLMcU2fouLpS2J00aXcTjAcc"
                >
                </stripe-buy-button>
              </div>

              <button className="btn btn-secondary mt-4" onClick={() => setIsSubmitted(false)}>Book Another Session</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {error && <div style={{ color: '#f87171', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '4px' }}>{error}</div>}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>What do you need help with?</label>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Pointers, Arrays, Debugging Homework 3"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Urgency</label>
                  <select 
                    value={urgency} 
                    onChange={(e) => setUrgency(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: 'white' }}
                  >
                    <option value="Low">Low - Whenever</option>
                    <option value="Medium">Medium - Next few days</option>
                    <option value="High">High - Before an exam/deadline</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Preferred Time</label>
                  <input 
                    type="text" 
                    value={preferredTime} 
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="e.g. Tomorrow evening"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Additional Details</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your current struggle or attach a snippet link..."
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn" style={{ width: '100%' }}>Submit Request</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
