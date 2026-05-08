import React, { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { User, Menu, X } from 'lucide-react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Hero from './components/Hero'
import NewcomerGuide from './components/NewcomerGuide'
import Quiz from './components/Quiz'
import CheatSheet from './components/CheatSheet'
import Flashcards from './components/Flashcards'
import Playground from './components/Playground'
import Leaderboard from './components/Leaderboard'
import AboutMe from './components/AboutMe'
import CommonMistakes from './components/CommonMistakes'
import Feedback from './components/Feedback'
import ProblemSet from './components/ProblemSet'
import Notes from './components/Notes'
import AdminPanel from './components/AdminPanel'
import Auth from './components/Auth'
import Course from './components/Course'
import Profile from './components/Profile'
import FAQ from './components/FAQ'
import Tutoring from './components/Tutoring'

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('student');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(() => !localStorage.getItem('cs110_banner_dismissed'));

  useEffect(() => {
    if (!auth) {
      // Fallback check for mock login
      const token = localStorage.getItem('cs110_auth_token');
      const savedName = localStorage.getItem('cs110_username');
      const savedRole = localStorage.getItem('cs110_role') || 'student';
      if (token) {
        setIsAuthenticated(true);
        if (savedName) setUserName(savedName);
        setUserRole(savedRole);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserName(user.displayName || user.email?.split('@')[0] || 'Student');
        const savedRole = localStorage.getItem('cs110_role') || 'student';
        setUserRole(savedRole);
      } else {
        // Fallback check for mock login
        const token = localStorage.getItem('cs110_auth_token');
        const savedName = localStorage.getItem('cs110_username');
        const savedRole = localStorage.getItem('cs110_role') || 'student';
        if (token) {
          setIsAuthenticated(true);
          if (savedName) setUserName(savedName);
          setUserRole(savedRole);
        } else {
          setIsAuthenticated(false);
          setUserName('');
          setUserRole('student');
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = (name, role) => {
    setIsAuthenticated(true);
    setUserName(name);
    setUserRole(role);
    setCurrentView('home');
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    
    localStorage.removeItem('cs110_auth_token');
    localStorage.removeItem('cs110_username');
    localStorage.removeItem('cs110_role');
    setIsAuthenticated(false);
    setUserName('');
    setUserRole('student');
    setCurrentView('home');
  };

  // Guard protected routes
  const renderView = () => {
    if (['admin', 'feedback', 'profile'].includes(currentView) && !isAuthenticated) {
      return <Auth onLogin={handleLogin} />;
    }

    if (currentView === 'login') {
      if (isAuthenticated) return <Hero onStartGuide={() => setCurrentView('guide')} onStartQuiz={() => setCurrentView('quiz')} />;
      return <Auth onLogin={handleLogin} />;
    }

    // Role-based Access Control
    if (currentView === 'admin' && !['superadmin', 'quiz_manager'].includes(userRole)) {
      return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
          <div className="glass-panel">
            <h2 className="text-gradient mb-4">Access Denied</h2>
            <p className="mb-4">You do not have administrative privileges to view this page.</p>
            <button className="btn" onClick={() => setCurrentView('home')}>Return Home</button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home': return <Hero onStartGuide={() => setCurrentView('guide')} onStartQuiz={() => setCurrentView('quiz')} />;
      case 'guide': return <NewcomerGuide />;
      case 'quiz': return <Quiz isAuthenticated={isAuthenticated} onRequireAuth={() => setCurrentView('login')} />;
      case 'course': return <Course isAuthenticated={isAuthenticated} onRequireAuth={() => setCurrentView('login')} />;
      case 'playground': return <Playground />;
      case 'problems': return <ProblemSet onSolve={() => setCurrentView('playground')} userRole={userRole} />;
      case 'cheatsheet': return <CheatSheet />;
      case 'flashcards': return <Flashcards />;
      case 'mistakes': return <CommonMistakes />;
      case 'notes': return <Notes />;
      case 'leaderboard': return <Leaderboard />;
      case 'about': return <AboutMe />;
      case 'faq': return <FAQ />;
      case 'feedback': return <Feedback />;
      case 'tutoring': return <Tutoring isAuthenticated={isAuthenticated} userName={userName} />;
      case 'profile': return <Profile onUpdateName={setUserName} />;
      case 'admin': return <AdminPanel onPreview={() => setCurrentView('course')} />;
      default: return <Hero onStartGuide={() => setCurrentView('guide')} onStartQuiz={() => setCurrentView('quiz')} />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`}>
        <div className="mobile-nav-section">Learn</div>
        <button onClick={() => { setCurrentView('guide'); setMobileNavOpen(false); }}>📖 Guide (Start Here)</button>
        <button onClick={() => { setCurrentView('course'); setMobileNavOpen(false); }} style={{ color: '#fbbf24' }}>★ Premium Course</button>
        <button onClick={() => { setCurrentView('cheatsheet'); setMobileNavOpen(false); }}>Cheat Sheet</button>
        <button onClick={() => { setCurrentView('mistakes'); setMobileNavOpen(false); }}>Common Mistakes</button>
        <button onClick={() => { setCurrentView('faq'); setMobileNavOpen(false); }}>FAQ</button>

        <div className="mobile-nav-section">Practice</div>
        <button onClick={() => { setCurrentView('quiz'); setMobileNavOpen(false); }}>Assessment</button>
        <button onClick={() => { setCurrentView('problems'); setMobileNavOpen(false); }}>Problem Set</button>
        <button onClick={() => { setCurrentView('playground'); setMobileNavOpen(false); }}>Playground</button>
        <button onClick={() => { setCurrentView('flashcards'); setMobileNavOpen(false); }}>Flashcards</button>
        <button onClick={() => { setCurrentView('notes'); setMobileNavOpen(false); }}>My Notes</button>

        <div className="mobile-nav-section">Community</div>
        <button onClick={() => { setCurrentView('leaderboard'); setMobileNavOpen(false); }}>Class Leaderboard</button>
        <button onClick={() => { setCurrentView('tutoring'); setMobileNavOpen(false); }}>1-on-1 Tutoring</button>
        <button onClick={() => { setCurrentView('feedback'); setMobileNavOpen(false); }}>Feedback</button>
        <button onClick={() => { setCurrentView('about'); setMobileNavOpen(false); }}>About Me</button>

        {isAuthenticated && (
          <>
            <div className="mobile-nav-section">Account</div>
            <button onClick={() => { setCurrentView('profile'); setMobileNavOpen(false); }}>My Profile</button>
            {['superadmin', 'quiz_manager'].includes(userRole) && (
              <button onClick={() => { setCurrentView('admin'); setMobileNavOpen(false); }} style={{ color: '#fbbf24' }}>⚙ Admin Dashboard</button>
            )}
            <button onClick={() => { handleLogout(); setMobileNavOpen(false); }} style={{ color: '#f87171' }}>Logout</button>
          </>
        )}
        {!isAuthenticated && (
          <button onClick={() => { setCurrentView('login'); setMobileNavOpen(false); }} style={{ color: 'var(--accent-color)', marginTop: '1rem' }}>Sign In →</button>
        )}
      </div>

      <nav className="nav-bar">
        {/* Logo */}
        <div className="logo text-gradient" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          C++ Thinker Lab
        </div>

        {/* Desktop nav */}
        <div className="nav-links">
          {/* Learn dropdown */}
          <div className="dropdown">
            <button className={['guide','course','cheatsheet','mistakes','faq'].includes(currentView) ? 'active' : ''}>
              Learn ▾
            </button>
            <div className="dropdown-content">
              <button onClick={() => setCurrentView('guide')}>📖 Guide (Start Here)</button>
              <button onClick={() => setCurrentView('cheatsheet')}>Cheat Sheet</button>
              <button onClick={() => setCurrentView('mistakes')}>Common Mistakes</button>
              <button onClick={() => setCurrentView('faq')}>FAQ</button>
            </div>
          </div>

          {/* Practice dropdown */}
          <div className="dropdown">
            <button className={['quiz','problems','playground','flashcards','notes'].includes(currentView) ? 'active' : ''}>
              Practice ▾
            </button>
            <div className="dropdown-content">
              <button onClick={() => setCurrentView('quiz')}>Assessment</button>
              <button onClick={() => setCurrentView('problems')}>Problem Set</button>
              <button onClick={() => setCurrentView('playground')}>Playground</button>
              <button onClick={() => setCurrentView('flashcards')}>Flashcards</button>
              <button onClick={() => setCurrentView('notes')}>My Notes</button>
            </div>
          </div>

          {/* Community dropdown */}
          <div className="dropdown">
            <button className={['leaderboard','about','feedback','tutoring'].includes(currentView) ? 'active' : ''}>
              Community ▾
            </button>
            <div className="dropdown-content">
              <button onClick={() => setCurrentView('leaderboard')}>Class Leaderboard</button>
              <button onClick={() => setCurrentView('tutoring')}>1-on-1 Tutoring</button>
              <button onClick={() => setCurrentView('feedback')}>Feedback</button>
              <button onClick={() => setCurrentView('about')}>About Me</button>
            </div>
          </div>

          {/* Premium Course — standalone CTA */}
          <button className={`nav-premium ${currentView === 'course' ? 'active' : ''}`} onClick={() => setCurrentView('course')}>
            ★ Premium Course
          </button>
        </div>

        {/* Right side: user + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div className="dropdown">
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <User size={16} color="var(--accent-color)" />
                {userName.split(' ')[0]} ▾
              </button>
              <div className="dropdown-content" style={{ right: 0, left: 'auto', minWidth: '180px', transform: 'none' }}>
                <button onClick={() => setCurrentView('profile')}>My Profile</button>
                {['superadmin', 'quiz_manager'].includes(userRole) && (
                  <button onClick={() => setCurrentView('admin')} style={{ color: '#fbbf24' }}>⚙ Admin Dashboard</button>
                )}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.25rem 0' }}></div>
                <button onClick={handleLogout} style={{ color: '#f87171' }}>Logout</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="btn btn-secondary"
              style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '20px', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
            >
              <User size={16} /> Sign In
            </button>
          )}

          {/* Hamburger */}
          <button className={`hamburger ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(v => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main>
        {showBanner && currentView === 'home' && (
          <div className="onboarding-banner">
            <p>👋 <strong>New here?</strong> Start with <button onClick={() => setCurrentView('guide')} style={{ background:'none', border:'none', color:'var(--accent-color)', cursor:'pointer', fontWeight:'bold', padding:0, fontSize:'inherit' }}>the Guide</button> → try the <button onClick={() => setCurrentView('quiz')} style={{ background:'none', border:'none', color:'var(--accent-color)', cursor:'pointer', fontWeight:'bold', padding:0, fontSize:'inherit' }}>Assessment</button> → tackle a <button onClick={() => setCurrentView('problems')} style={{ background:'none', border:'none', color:'var(--accent-color)', cursor:'pointer', fontWeight:'bold', padding:0, fontSize:'inherit' }}>Problem</button> 🚀</p>
            <button className="dismiss" onClick={() => { setShowBanner(false); localStorage.setItem('cs110_banner_dismissed', '1'); }}>Got it ✕</button>
          </div>
        )}
        {renderView()}
      </main>

      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.85rem'
      }}>
        <p>© {new Date().getFullYear()} C++ Thinker Lab</p>
        <p style={{ marginTop: '0.5rem' }}>
          Developed by Dm. Mehedi Hasan Abid for CS:110 Programming and Problem Solving.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <a href="https://mh-1294.github.io/abid/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            Visit my Website
          </a>
        </p>
      </footer>
      <Analytics />
    </div>
  )
}

export default App
