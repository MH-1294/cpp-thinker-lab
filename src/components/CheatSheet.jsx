import React from 'react';
import { cheatsheet } from '../data/cheatsheet';

export default function CheatSheet() {
  return (
    <div className="animate-fade-in">
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient"><span className="ali-highlight">C++ Cheat Sheet</span></h2>
        <p>A quick reference guide for common C++ syntax and concepts.</p>
      </div>

      <div className="feature-grid" style={{ marginTop: '0' }}>
        {cheatsheet.map((section, idx) => (
          <div key={idx} className="feature-card" style={{ alignSelf: 'start' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              {section.category}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h4>
                  <pre style={{ margin: '0 0 0.5rem 0' }}>
                    <code>{item.code}</code>
                  </pre>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
