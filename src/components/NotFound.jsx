import React from 'react';
import { Home } from 'lucide-react';

export default function NotFound({ onGoHome }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
      <img 
        src="/404-doodle.png" 
        alt="404 Page Not Found Doodle" 
        style={{ maxWidth: '400px', width: '100%', marginBottom: '2rem', borderRadius: '12px' }} 
      />
      <h1 className="text-gradient mb-4" style={{ fontSize: '3rem' }}>404</h1>
      <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Oops! Page Not Found</h2>
      <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '2rem' }}>
        Our little binary buddy couldn't locate that particular bit of knowledge. It seems you've navigated to a route that doesn't exist!
      </p>
      <button onClick={onGoHome} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>
        <Home size={20} /> Back to Learning
      </button>
    </div>
  );
}
