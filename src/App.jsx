import React, { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { User, Menu, X } from 'lucide-react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth'
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
import Legal from './components/Legal'
import Contests from './components/Contests'
import ContestView from './components/ContestView'

// ─── Accessible Dropdown Component ────────────────────────────────────────────
function NavDropdown({ id, label, isActive, align = 'center', openDropdown, setOpenDropdown, dropdownRef, children }) {
  const triggerRef = useRef(null);
  const isOpen = openDropdown === id;

  const open  = () => setOpenDropdown(id);
  const close = () => { setOpenDropdown(null); triggerRef.current?.focus(); };
  const toggle = () => (isOpen ? close() : open());

  const handleTriggerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open();
      requestAnimationFrame(() => {
        dropdownRef.current?.querySelector('[role="menuitem"]')?.focus();
      });
    }
    if (e.key === 'Escape') close();
  };

  const handleMenuKeyDown = (e) => {
    const items = [...(dropdownRef.current?.querySelectorAll('[role="menuitem"]') || [])];
    const idx   = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[idx + 1]?.focus(); }
    if (e.key === 'ArrowUp')   {
      e.preventDefault();
      idx <= 0 ? triggerRef.current?.focus() : items[idx - 1]?.focus();
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab')    close();
  };

  return (
    <div
      className={`dropdown${isOpen ? ' dropdown--open' : ''}`}
      ref={dropdownRef}
      onMouseEnter={open}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <button
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onKeyDown={handleTriggerKeyDown}
        onClick={toggle}
        className={isActive ? 'active' : ''}
      >
        {label}
      </button>
      <div
        className={`dropdown-content${align === 'right' ? ' dropdown-content-right' : ''}`}
        role="menu"
        aria-label={typeof label === 'string' ? label.replace(' ▾', '') : undefined}
        onKeyDown={handleMenuKeyDown}
      >
        {children}
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────────

function App() {
  const [currentView, setCurrentView] = useState('home');
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isAuthLoading, setIsAuthLoading] = useState(true);
   const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('student');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(() => !localStorage.getItem('cs110_banner_dismissed'));
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    learn:     useRef(null),
    practice:  useRef(null),
    community: useRef(null),
    user:      useRef(null),
  };

  // --- CONTEST TRANSITION STATE ---
  const [selectedContest, setSelectedContest] = useState(null);
  const [contestProblem, setContestProblem] = useState(null);
  // --- ROUTING LOGIC ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash !== currentView) setCurrentView(hash);
    };

    // Initialize from hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && initialHash !== currentView) {
      setCurrentView(initialHash);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (window.location.hash.replace('#', '') !== currentView) {
      window.location.hash = currentView;
    }
  }, [currentView]);

  const [userId, setUserId] = useState(() => localStorage.getItem('cs110_uid') || 'guest-' + Date.now());

  useEffect(() => {
    if (!localStorage.getItem('cs110_uid')) {
      localStorage.setItem('cs110_uid', userId);
    }
  }, [userId]);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // --- AUTH SYNC ---
  useEffect(() => {
    if (!auth) {
      // Robust Fallback for Mock Login (when API keys are missing on Vercel)
      const mockToken = localStorage.getItem('cs110_auth_token');
      if (mockToken && mockToken !== 'firebase_active') {
        const savedName = localStorage.getItem('cs110_username') || 'Student';
        const savedRole = localStorage.getItem('cs110_role') || 'student';
        setIsAuthenticated(true);
        setUserName(savedName);
        setUserRole(savedRole);
      }
      setIsAuthLoading(false);
      return;
    }

    // Handle redirect results
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        // Handled by onAuthStateChanged
      }
      setIsAuthLoading(false);
    }).catch(err => {
      console.error("Redirect Auth Error:", err);
      setIsAuthLoading(false);
      if (err.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized in Firebase Console. Please add it to Authorized Domains.");
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthLoading(false);
      if (user) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'Student';
        
        // Determine role
        let role = 'student';
        const userEmail = (user.email || '').toLowerCase();
        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
        
        if (adminEmail && userEmail === adminEmail) role = 'superadmin';
        else if (userEmail.includes('admin')) role = 'superadmin';
        else if (userEmail.includes('ta') || userEmail.includes('manager')) role = 'quiz_manager';

        setUserName(displayName);
        setUserRole(role);
        setIsAuthenticated(true);
        setUserId(user.uid);
        
        localStorage.setItem('cs110_username', displayName);
        localStorage.setItem('cs110_role', role);
        localStorage.setItem('cs110_auth_token', 'firebase_active');
      } else {
        const mockToken = localStorage.getItem('cs110_auth_token');
        if (mockToken === 'firebase_active' || !mockToken) {
          setIsAuthenticated(false);
          setUserName('');
          setUserRole('student');
        } else if (mockToken) {
          // Keep mock login active
          setIsAuthenticated(true);
          setUserName(localStorage.getItem('cs110_username') || 'Student');
          setUserRole(localStorage.getItem('cs110_role') || 'student');
        }
      }
    });

    return () => unsubscribe && unsubscribe();
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
  if (isAuthLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#94a3b8' }}>Verifying session...</p>
        </div>
      </div>
    );
  }

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
      case 'playground': return <Playground contestContext={contestProblem} />;
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
      case 'legal':         return <Legal defaultTab="copyright" />;
      case 'legal-privacy': return <Legal defaultTab="privacy" />;
      case 'legal-credits': return <Legal defaultTab="credits" />;
      case 'contests': return (
        <Contests 
          onViewContest={(contest) => {
            setSelectedContest(contest);
            setCurrentView('contest-view');
          }} 
        />
      );
      case 'contest-view': return (
        <ContestView 
          contest={selectedContest} 
          userId={userId}
          onBack={() => setCurrentView('contests')}
          onSolve={(problem, contestId, teamName) => {
            setContestProblem({ problemId: problem.firestoreId, contestId, userId, userName, teamName });
            setCurrentView('playground');
          }}
        />
      );
      default: return <Hero onStartGuide={() => setCurrentView('guide')} onStartQuiz={() => setCurrentView('quiz')} />;
    }
  };

  return (
    <div className="app-container">
      {/* Skip to main content — WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Mobile overlay */}
      <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(false)} />

      {/* Mobile drawer */}
      <div id="mobile-nav-drawer" className={`mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`} role="dialog" aria-label="Navigation menu" aria-modal="true">
        <div className="mobile-nav-section">Learn</div>
        <button onClick={() => { setCurrentView('guide'); setMobileNavOpen(false); }}>📖 Guide (Start Here)</button>
        <button onClick={() => { setCurrentView('course'); setMobileNavOpen(false); }} style={{ color: '#fbbf24' }}>★ Course</button>
        <button onClick={() => { setCurrentView('cheatsheet'); setMobileNavOpen(false); }}>Cheat Sheet</button>
        <button onClick={() => { setCurrentView('mistakes'); setMobileNavOpen(false); }}>Common Mistakes</button>
        <button onClick={() => { setCurrentView('faq'); setMobileNavOpen(false); }}>FAQ</button>

        <div className="mobile-nav-section">Practice</div>
        <button onClick={() => { setCurrentView('quiz'); setMobileNavOpen(false); }}>Assessment</button>
        <button onClick={() => { setCurrentView('contests'); setMobileNavOpen(false); }} style={{ color: 'var(--accent-color)' }}>🏆 Contests</button>
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

        <div className="mobile-nav-section">Legal</div>
        <button onClick={() => { setCurrentView('legal-privacy'); setMobileNavOpen(false); }}>🔒 Privacy Policy</button>
        <button onClick={() => { setCurrentView('legal-credits'); setMobileNavOpen(false); }}>🙏 Credits</button>
      </div>

      <nav className="nav-bar" aria-label="Main navigation">
        {/* Logo — button so keyboard users can focus it */}
        <button
          className="logo"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onClick={() => setCurrentView('home')}
          aria-label="C++ Thinker Lab — go to home"
        >
          <span className="text-gradient">C++ Thinker Lab</span>
        </button>

        {/* Desktop nav */}
        <div className="nav-links" role="menubar" aria-label="Site sections">

          {/* Learn dropdown */}
          <NavDropdown
            id="learn"
            label="Learn ▾"
            isActive={['guide','cheatsheet','mistakes','faq'].includes(currentView)}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            dropdownRef={dropdownRefs.learn}
          >
            <button role="menuitem" onClick={() => { setCurrentView('guide');      setOpenDropdown(null); }}>📖 Guide (Start Here)</button>
            <button role="menuitem" onClick={() => { setCurrentView('cheatsheet'); setOpenDropdown(null); }}>Cheat Sheet</button>
            <button role="menuitem" onClick={() => { setCurrentView('mistakes');   setOpenDropdown(null); }}>Common Mistakes</button>
            <button role="menuitem" onClick={() => { setCurrentView('faq');        setOpenDropdown(null); }}>FAQ</button>
          </NavDropdown>

          {/* Practice dropdown */}
          <NavDropdown
            id="practice"
            label="Practice ▾"
            isActive={['quiz','problems','playground','flashcards','notes','contests','contest-view'].includes(currentView)}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            dropdownRef={dropdownRefs.practice}
          >
            <button role="menuitem" onClick={() => { setCurrentView('quiz');        setOpenDropdown(null); }}>Assessment</button>
            <button role="menuitem" onClick={() => { setCurrentView('contests');    setOpenDropdown(null); }} style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>🏆 Contests</button>
            <button role="menuitem" onClick={() => { setCurrentView('problems');    setOpenDropdown(null); }}>Problem Set</button>
            <button role="menuitem" onClick={() => { setCurrentView('playground');  setOpenDropdown(null); }}>Playground</button>
            <button role="menuitem" onClick={() => { setCurrentView('flashcards');  setOpenDropdown(null); }}>Flashcards</button>
            <button role="menuitem" onClick={() => { setCurrentView('notes');       setOpenDropdown(null); }}>My Notes</button>
          </NavDropdown>

          {/* Community dropdown */}
          <NavDropdown
            id="community"
            label="Community ▾"
            isActive={['leaderboard','about','feedback','tutoring'].includes(currentView)}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            dropdownRef={dropdownRefs.community}
          >
            <button role="menuitem" onClick={() => { setCurrentView('leaderboard'); setOpenDropdown(null); }}>Class Leaderboard</button>
            <button role="menuitem" onClick={() => { setCurrentView('tutoring');    setOpenDropdown(null); }}>1-on-1 Tutoring</button>
            <button role="menuitem" onClick={() => { setCurrentView('feedback');    setOpenDropdown(null); }}>Feedback</button>
            <button role="menuitem" onClick={() => { setCurrentView('about');       setOpenDropdown(null); }}>About Me</button>
          </NavDropdown>

          {/* Premium Course — standalone CTA */}
          <button
            className={`nav-premium ${currentView === 'course' ? 'active' : ''}`}
            onClick={() => setCurrentView('course')}
            aria-current={currentView === 'course' ? 'page' : undefined}
          >
            ★ Course
          </button>
        </div>

        {/* Right side: user menu + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <NavDropdown
              id="user"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="var(--accent-color)" />
                  {userName.split(' ')[0]} ▾
                </span>
              }
              isActive={['profile','admin'].includes(currentView)}
              align="right"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              dropdownRef={dropdownRefs.user}
            >
              <button
                role="menuitem"
                onClick={() => { setCurrentView('profile'); setOpenDropdown(null); }}
              >
                My Profile
              </button>
              {['superadmin', 'quiz_manager'].includes(userRole) && (
                <button
                  role="menuitem"
                  onClick={() => { setCurrentView('admin'); setOpenDropdown(null); }}
                  style={{ color: '#fbbf24' }}
                >
                  ⚙ Admin Dashboard
                </button>
              )}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.25rem 0' }} role="separator" />
              <button
                role="menuitem"
                onClick={() => { handleLogout(); setOpenDropdown(null); }}
                style={{ color: '#f87171' }}
              >
                Logout
              </button>
            </NavDropdown>
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
          <button
            className={`hamburger ${mobileNavOpen ? 'open' : ''}`}
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav-drawer"
          >
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1}>
        {showBanner && currentView === 'home' && (
          <div className="onboarding-banner">
            <p>👋 <strong>New here?</strong> Start with <button onClick={() => setCurrentView('guide')} style={{ background:'none', border:'none', color:'var(--accent-color)', cursor:'pointer', fontWeight:'bold', padding:0, fontSize:'inherit' }}>the Guide</button> → try the <button onClick={() => setCurrentView('quiz')} style={{ background:'none', border:'none', color:'var(--accent-color)', cursor:'pointer', fontWeight:'bold', padding:0, fontSize:'inherit' }}>Assessment</button> → tackle a <button onClick={() => setCurrentView('problems')} style={{ background:'none', border:'none', color:'var(--accent-color)', cursor:'pointer', fontWeight:'bold', padding:0, fontSize:'inherit' }}>Problem</button> 🚀</p>
            <button className="dismiss" onClick={() => { setShowBanner(false); localStorage.setItem('cs110_banner_dismissed', '1'); }}>Got it ✕</button>
          </div>
        )}
        {renderView()}
      </main>

      <footer className="site-footer" aria-label="Site footer">
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand">
            <div className="footer-logo text-gradient">C++ Thinker Lab</div>
            <p className="footer-tagline">
              A free learning platform for CS:110 students — built to help you think like a programmer.
            </p>
            <p className="footer-location">🇨🇦 Built with ❤️ in Regina, SK, Canada</p>
            <span className="wcag-badge" title="Web Content Accessibility Guidelines 2.1 Level AA compliant">✓ WCAG 2.1 AA</span>
          </div>

          {/* Learn column */}
          <nav className="footer-col" aria-label="Learn section links">
            <h3>Learn</h3>
            <button onClick={() => setCurrentView('guide')}>Guide (Start Here)</button>
            <button onClick={() => setCurrentView('cheatsheet')}>Cheat Sheet</button>
            <button onClick={() => setCurrentView('mistakes')}>Common Mistakes</button>
            <button onClick={() => setCurrentView('faq')}>FAQ</button>
            <button onClick={() => setCurrentView('course')} className="footer-premium">★ Course</button>
          </nav>

          {/* Practice column */}
          <nav className="footer-col" aria-label="Practice section links">
            <h3>Practice</h3>
            <button onClick={() => setCurrentView('quiz')}>Assessment</button>
            <button onClick={() => setCurrentView('contests')}>Contests</button>
            <button onClick={() => setCurrentView('problems')}>Problem Set</button>
            <button onClick={() => setCurrentView('playground')}>Playground</button>
            <button onClick={() => setCurrentView('flashcards')}>Flashcards</button>
            <button onClick={() => setCurrentView('notes')}>My Notes</button>
          </nav>

          {/* Community column */}
          <nav className="footer-col" aria-label="Community section links">
            <h3>Community</h3>
            <button onClick={() => setCurrentView('leaderboard')}>Class Leaderboard</button>
            <button onClick={() => setCurrentView('tutoring')}>1-on-1 Tutoring</button>
            <button onClick={() => setCurrentView('feedback')}>Give Feedback</button>
            <button onClick={() => setCurrentView('about')}>About the Instructor</button>
          </nav>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} C++ Thinker Lab &nbsp;·&nbsp; Developed by Mehedi Hasan Abid &nbsp;·&nbsp; CS:110 Programming and Problem Solving, University of Regina
          </p>
          <div className="footer-bottom-links">
            <a
              href="https://mh-1294.github.io/abid/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Mehedi's personal website (opens in new tab)"
            >
              Visit my Website ↗
            </a>
            <span aria-hidden="true">·</span>
            <button onClick={() => setCurrentView('legal-privacy')} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>Privacy Policy</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setCurrentView('legal-credits')} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>Credits</button>
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '1rem' }}>
              Build ID: 2026.05.13.0418 | Stable
            </div>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  )
}

export default App
