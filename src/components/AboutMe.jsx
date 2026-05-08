import React from 'react';

export default function AboutMe() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <img 
          src="https://mh-1294.github.io/abid/assets/img/mehedi_pic.jpg" 
          alt="Dm. Mehedi Hasan Abid" 
          style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent-color)' }}
        />
        <div>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dm. Mehedi Hasan Abid</h2>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: '500' }}>PhD Student · Machine Learning & AI</p>
          <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>University of Regina</p>
        </div>
      </div>

      <div className="glass-panel mb-4">
        <h3 className="mb-2">About Me</h3>
        <p className="mb-2">
          I am Dm. Mehedi Hasan Abid, a PhD student in the Department of Computer Science at the University of Regina, Canada, working under the supervision of Dr. JingTao Yao.
        </p>
        <p className="mb-2">
          My research focuses on Machine Learning, Explainable Artificial Intelligence (XAI) and Three-way clustering, with an emphasis on building <span className="ali-highlight">interpretable, reliable, and efficient AI systems</span> for real-world applications.
        </p>
        <p>
          My current work explores three-way clustering, uncertainty-aware learning, and interpretable deep models, particularly in domains such as agriculture and healthcare.
        </p>
      </div>

      <div className="glass-panel mb-4">
        <h3 className="mb-2">Academic & Professional Background</h3>
        <p className="mb-2">
          Previously, I served as a Lecturer and Senior Administrative Officer at Daffodil International University (DIU), Bangladesh. I taught undergraduate courses, supervised thesis projects, and contributed to academic program development at the Human Resource Development Institute (HRDI).
        </p>
        <p className="mb-2">
          In my administrative role, I trained 5+ faculty trainers, supported 15+ departments, and guided over 300 faculty members in online teaching methodologies and effective remote instruction.
        </p>
        <p>
          My work bridges research, teaching, and real-world deployment of intelligent systems.
        </p>
      </div>

      <div className="feature-grid" style={{ marginTop: '0', marginBottom: '2rem' }}>
        <div className="feature-card">
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Research Interests
          </h3>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Machine Learning</li>
            <li>Explainable AI (XAI)</li>
            <li>Three-Way Clustering</li>
            <li>Deep Learning & Interpretability</li>
            <li>Uncertainty-Aware AI Systems</li>
          </ul>
        </div>

        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Contact & Office
          </h3>
          <p className="mb-2">
            <strong>Office:</strong> CW 308.4 College West<br />
            3737 Wascana Pkwy<br />
            Regina, SK S4S 0A2, Canada
          </p>
          <a href="https://mh-1294.github.io/abid/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Visit My Website
          </a>

          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', paddingTop: '1rem', color: '#fbbf24' }}>
            Support This Project
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Building and maintaining these educational resources takes countless hours. If you find this platform helpful, consider buying me a coffee!
          </p>
          <button className="btn" style={{ background: '#fbbf24', color: '#0f172a', fontWeight: 'bold' }}>
            ☕ Buy me a Coffee
          </button>
        </div>
      </div>
    </div>
  );
}
