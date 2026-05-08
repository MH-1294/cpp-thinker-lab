import React, { useState } from 'react';

const YEAR = new Date().getFullYear();

const TOOLS = [
  {
    category: 'Core Framework',
    items: [
      { name: 'React 18', role: 'UI library — component architecture & state management', url: 'https://react.dev' },
      { name: 'Vite 4', role: 'Build tool & local development server', url: 'https://vitejs.dev' },
    ],
  },
  {
    category: 'Backend & Database',
    items: [
      { name: 'Firebase Authentication', role: 'Secure user sign-in (Google, Email/Password)', url: 'https://firebase.google.com' },
      { name: 'Cloud Firestore', role: 'Real-time database — leaderboard, feedback, problems', url: 'https://firebase.google.com/products/firestore' },
    ],
  },
  {
    category: 'Hosting & Analytics',
    items: [
      { name: 'Vercel', role: 'Hosting, CI/CD deployment pipeline, edge network', url: 'https://vercel.com' },
      { name: 'Vercel Analytics', role: 'Privacy-friendly page view analytics', url: 'https://vercel.com/analytics' },
    ],
  },
  {
    category: 'Design & Icons',
    items: [
      { name: 'Lucide React', role: 'Accessible SVG icon library', url: 'https://lucide.dev' },
      { name: 'Google Fonts — Inter', role: 'Primary UI typeface', url: 'https://fonts.google.com/specimen/Inter' },
      { name: 'Google Fonts — Fira Code', role: 'Monospace / code typeface', url: 'https://fonts.google.com/specimen/Fira+Code' },
    ],
  },
  {
    category: 'AI Development Tools',
    items: [
      {
        name: 'Antigravity (Google DeepMind)',
        role: 'AI coding assistant — architecture, implementation, accessibility, and iterative development of this platform',
        url: 'https://deepmind.google',
        highlight: true,
      },
    ],
  },
];

export default function Legal({ defaultTab = 'copyright' }) {
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Legal &amp; Credits
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            C++ Thinker Lab · University of Regina · CS:110 Programming and Problem Solving
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0' }}>
          {[
            { id: 'copyright', label: '© Copyright & Terms' },
            { id: 'privacy',   label: '🔒 Privacy Policy' },
            { id: 'credits',   label: '🙏 Credits' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: tab === t.id ? 'var(--accent-color)' : '#64748b',
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.6rem 1.1rem',
                borderBottom: tab === t.id ? '2px solid var(--accent-color)' : '2px solid transparent',
                transition: 'all 0.2s',
                marginBottom: '-1px',
                borderRadius: '8px 8px 0 0',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Copyright & Terms ── */}
        {tab === 'copyright' && (
          <div style={{ lineHeight: 1.8, color: '#94a3b8' }}>
            <Section title={`© ${YEAR} C++ Thinker Lab`}>
              <p>
                All original content on this platform — including course material, quiz questions,
                problem sets, cheat sheets, and written explanations — is the intellectual property
                of <strong style={{ color: '#e2e8f0' }}>Mehedi Hasan Abid</strong>, unless otherwise stated.
              </p>
            </Section>

            <Section title="Permitted Use">
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Students enrolled in CS:110 at the University of Regina may freely use all materials for personal study.</li>
                <li>Instructors may reference or adapt content with attribution.</li>
                <li>Non-commercial sharing with attribution is permitted.</li>
              </ul>
            </Section>

            <Section title="Restrictions">
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Redistribution for commercial purposes is prohibited without written permission.</li>
                <li>Reproducing quiz questions or problem sets in other platforms requires prior consent.</li>
                <li>Automated scraping of content is not permitted.</li>
              </ul>
            </Section>

            <Section title="Disclaimer">
              <p>
                This platform is provided <strong style={{ color: '#e2e8f0' }}>as-is</strong> for educational purposes.
                While every effort is made to ensure accuracy, the creator makes no warranty regarding
                correctness, completeness, or fitness for any particular purpose. Content is supplementary
                to official CS:110 course material.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                For permissions or inquiries, visit{' '}
                <a href="https://mh-1294.github.io/abid/" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent-color)' }}>
                  mh-1294.github.io/abid
                </a>.
              </p>
            </Section>
          </div>
        )}

        {/* ── Privacy Policy ── */}
        {tab === 'privacy' && (
          <div style={{ lineHeight: 1.8, color: '#94a3b8' }}>
            <p style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#7dd3fc' }}>
              🇨🇦 This privacy policy is written in accordance with Canada's <strong>PIPEDA</strong> (Personal Information Protection and Electronic Documents Act) and aligns with the University of Regina's data governance standards.
            </p>

            <Section title="What Information We Collect">
              <p style={{ marginBottom: '0.75rem' }}>When you create an account, we collect:</p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong style={{ color: '#e2e8f0' }}>Email address</strong> — for authentication only</li>
                <li><strong style={{ color: '#e2e8f0' }}>Display name</strong> — shown on the leaderboard (you control this)</li>
                <li><strong style={{ color: '#e2e8f0' }}>Quiz scores &amp; activity</strong> — stored to power the leaderboard and track your progress</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                Anonymous users (not logged in) generate no personally identifiable data.
              </p>
            </Section>

            <Section title="How We Use Your Information">
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>To authenticate your account securely via Firebase Authentication</li>
                <li>To display your progress on the Class Leaderboard</li>
                <li>To enable the 1-on-1 Tutoring request feature</li>
                <li>To improve the platform based on aggregated, anonymised usage patterns</li>
              </ul>
            </Section>

            <Section title="What We Do NOT Do">
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>❌ We do not sell your data to any third party</li>
                <li>❌ We do not use your data for advertising</li>
                <li>❌ We do not share identifiable data with anyone outside this platform</li>
                <li>❌ We do not store payment information (Stripe handles payments independently)</li>
              </ul>
            </Section>

            <Section title="Third-Party Services">
              <p style={{ marginBottom: '0.75rem' }}>This site uses the following third-party services, each with their own privacy policies:</p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong style={{ color: '#e2e8f0' }}>Google Firebase</strong> — authentication &amp; database (Google Privacy Policy)</li>
                <li><strong style={{ color: '#e2e8f0' }}>Vercel Analytics</strong> — privacy-friendly, cookieless page analytics</li>
              </ul>
            </Section>

            <Section title="Data Retention & Deletion">
              <p>
                You may request deletion of your account and all associated data at any time by
                contacting the instructor directly. Account data is retained only as long as the
                platform is in active use for CS:110.
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                This site does not use tracking cookies. Authentication state is managed via
                Firebase's secure session tokens stored in your browser's local storage.
                Vercel Analytics uses no cookies and collects no personal information.
              </p>
            </Section>

            <Section title="Your Rights (PIPEDA)">
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Right to access the personal information we hold about you</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to withdraw consent and request deletion</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                To exercise these rights, contact:{' '}
                <a href="https://mh-1294.github.io/abid/" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent-color)' }}>
                  mh-1294.github.io/abid
                </a>
              </p>
            </Section>

            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              Last updated: May {YEAR}
            </p>
          </div>
        )}

        {/* ── Credits ── */}
        {tab === 'credits' && (
          <div>
            {/* Creator highlight */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(74,0,224,0.15), rgba(142,45,226,0.15))',
              border: '1px solid rgba(142,45,226,0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
              }}>
                👨‍💻
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#e2e8f0' }}>Mehedi Hasan Abid</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  Creator, Developer &amp; Instructor · CS:110 · University of Regina
                </div>
                <a
                  href="https://mh-1294.github.io/abid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-color)', fontSize: '0.85rem', textDecoration: 'none', marginTop: '0.4rem', display: 'inline-block' }}
                >
                  mh-1294.github.io/abid ↗
                </a>
              </div>
            </div>

            {/* Tools grid */}
            {TOOLS.map(group => (
              <div key={group.category} style={{ marginBottom: '1.75rem' }}>
                <h3 style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: '#475569',
                  marginBottom: '0.75rem', paddingBottom: '0.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {group.category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.items.map(item => (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        background: item.highlight
                          ? 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(142,45,226,0.08))'
                          : 'rgba(255,255,255,0.02)',
                        border: item.highlight
                          ? '1px solid rgba(56,189,248,0.2)'
                          : '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, color: item.highlight ? 'var(--accent-color)' : '#e2e8f0', fontSize: '0.9rem' }}>
                            {item.name}
                          </span>
                          {item.highlight && (
                            <span style={{
                              fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                              background: 'rgba(56,189,248,0.15)', color: 'var(--accent-color)',
                              borderRadius: '9999px', border: '1px solid rgba(56,189,248,0.3)',
                            }}>
                              AI ASSISTANT
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                          {item.role}
                        </div>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${item.name} website`}
                          style={{ color: '#475569', fontSize: '0.8rem', textDecoration: 'none', flexShrink: 0, alignSelf: 'center' }}
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '2rem', textAlign: 'center' }}>
              Built with ❤️ in Regina, SK, Canada 🇨🇦
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.6rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
