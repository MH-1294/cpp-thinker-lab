import React, { useState, useEffect } from 'react';
import { User, Mail, Award, Settings, Save } from 'lucide-react';

export default function Profile({ onUpdateName }) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Stats & Course
  const [bestScore, setBestScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  useEffect(() => {
    // Load profile data
    const name = localStorage.getItem('cs110_username') || 'Student';
    setUserName(name);
    
    // In a real app, email comes from Auth context. We mock it here.
    const mockEmail = name.toLowerCase().replace(' ', '.') + '@example.com';
    setEmail(localStorage.getItem('cs110_user_email') || mockEmail);
    
    setBio(localStorage.getItem('cs110_user_bio') || 'Aspiring C++ Developer.');

    // Check Course Purchase State
    const isUnlocked = localStorage.getItem('cs110_course_unlocked') === 'true';
    setHasPurchased(isUnlocked);

    // Calculate stats from leaderboard data
    const lbData = localStorage.getItem('cs110_leaderboard');
    if (lbData) {
      try {
        const parsed = JSON.parse(lbData);
        // Find attempts belonging to this user
        const userAttempts = parsed.filter(entry => entry.name === name);
        setTotalAttempts(userAttempts.length);
        
        if (userAttempts.length > 0) {
          const max = Math.max(...userAttempts.map(u => u.score));
          setBestScore(max);
        }
      } catch (e) {
        console.error("Error parsing leaderboard data", e);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('cs110_username', userName.trim());
      localStorage.setItem('cs110_user_email', email);
      localStorage.setItem('cs110_user_bio', bio);
      
      // Notify parent to update nav bar
      if (onUpdateName) {
        onUpdateName(userName.trim());
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    // Simulate API call to save password
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordSaved(true);
    setTimeout(() => setIsPasswordSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Left Column: Stats & Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <User size={40} color="#0f172a" />
            </div>
            <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>{userName}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>{localStorage.getItem('cs110_role') === 'superadmin' ? 'Superadmin' : 'Student'}</p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Your Stats</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Best Quiz Score</span>
                <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>{bestScore} pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Total Attempts</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{totalAttempts}</span>
              </div>
            </div>
          </div>

          {/* COURSE UPSELL OR PROGRESS */}
          {hasPurchased ? (
            <div className="glass-panel" style={{ border: '1px solid var(--success-color)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--success-color)', marginBottom: '1rem' }}>C++ Course</h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem' }}>You have lifelong access to the full C++ curriculum.</p>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ width: '25%', height: '100%', background: 'var(--success-color)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Progress</span>
                <span>2/8 Lessons (25%)</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(15, 23, 42, 0.8))', border: '1px solid var(--accent-color)', textAlign: 'center' }}>
              <Award size={32} color="var(--accent-color)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Full Course</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>Get lifelong access to 40+ hours of video tutorials.</p>
              <button 
                onClick={() => {
                  alert("Please navigate to the ★ Course tab to purchase.");
                }} 
                className="btn" 
                style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}
              >
                Upgrade for $19 CAD
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Edit Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel">
            <h2 className="mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={24} color="var(--accent-color)" /> Edit Profile
            </h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Display Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                    required
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>This name appears on the Class Leaderboard.</p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
                    disabled
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Linked to your authentication provider.</p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Bio</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your C++ journey..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  rows="4"
                />
              </div>

              <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: isSaved ? 'var(--success-color)' : 'var(--accent-color)', color: '#0f172a' }}>
                {isSaved ? <><CheckCircle size={18} /> Profile Updated</> : <><Save size={18} /> Save Changes</>}
              </button>
            </form>
          </div>

          <div className="glass-panel">
            <h2 className="mb-4" style={{ color: 'white', fontSize: '1.2rem' }}>Change Password</h2>
            <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ marginTop: '0.5rem', background: isPasswordSaved ? 'var(--success-color)' : 'rgba(255,255,255,0.1)' }}>
                {isPasswordSaved ? 'Password Updated' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
