import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function Notes() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <BookOpen size={36} /> Instructor Notes
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Handwritten core concepts and visual explanations from the instructor.</p>
      </div>

      {/* Note 1: Pre vs Post Increment */}
      <div className="ipad-notes-container">
        <h3 className="handwritten-title">1. Pre vs Post Increment </h3>
        <p className="handwritten" style={{ color: 'white', marginBottom: '1rem' }}>
          What's the difference between <span style={{ color: '#f87171' }}>x++</span> and <span style={{ color: '#f87171' }}>++x</span>?
        </p>
        
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Fira Code, monospace', fontSize: '1.1rem' }}>
          <span style={{ color: '#a78bfa' }}>int</span> x = <span style={{ color: '#fbbf24' }}>5</span>;<br/><br/>
          <span style={{ color: '#64748b' }}>// Post-increment: Prints the old value (5) FIRST, then adds 1</span><br/>
          cout &lt;&lt; x++; <span className="handwritten handwritten-pink" style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}>&larr; Outputs 5 (But x becomes 6!)</span><br/><br/>
          
          <span style={{ color: '#64748b' }}>// Pre-increment: Adds 1 FIRST, then prints the new value</span><br/>
          cout &lt;&lt; ++x; <span className="handwritten handwritten-blue" style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}>&larr; Outputs 7 (Because x was 6, now 7)</span>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ArrowRight className="handwritten-pink" style={{ marginTop: '0.5rem', flexShrink: 0 }} />
          <p className="handwritten">
            Rule of thumb: If the <span style={{ color: '#f87171' }}>++</span> is AFTER the variable, the addition happens AFTER the current line finishes running!
          </p>
        </div>
      </div>

      {/* Note 2: Type Casting */}
      <div className="ipad-notes-container">
        <h3 className="handwritten-title">2. Type Casting & Division</h3>
        <p className="handwritten" style={{ color: 'white', marginBottom: '1rem' }}>
          Integer division drops the decimal! How do we keep the exact answer?
        </p>
        
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Fira Code, monospace', fontSize: '1.1rem', position: 'relative' }}>
          <span style={{ color: '#a78bfa' }}>int</span> total = <span style={{ color: '#fbbf24' }}>45</span>;<br/>
          <span style={{ color: '#a78bfa' }}>int</span> items = <span style={{ color: '#fbbf24' }}>7</span>;<br/><br/>
          
          <span style={{ color: '#64748b' }}>// 45 / 7 = 6 (Wrong!)</span><br/>
          <span style={{ color: '#a78bfa' }}>double</span> badAvg = total / items; <br/><br/>

          <span style={{ color: '#64748b' }}>// Solution: Temporarily turn 'total' into a double (45.0)</span><br/>
          <span style={{ color: '#a78bfa' }}>double</span> goodAvg = (<span style={{ color: '#a78bfa' }}>double</span>)total / items; <br/>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', bottom: '1.5rem', left: '11rem' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(15deg)' }}>
              <path d="M20 35 L20 10 M10 20 L20 10 L30 20" />
            </svg>
            <span className="handwritten handwritten-blue" style={{ marginTop: '0.5rem', whiteSpace: 'nowrap' }}>We call this "Casting"</span>
          </div>
          
          <br/><br/><br/>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ArrowRight className="handwritten-pink" style={{ marginTop: '0.5rem', flexShrink: 0 }} />
          <p className="handwritten">
            If both numbers are integers, C++ chops off the decimal! You MUST use casting <span style={{ color: '#38bdf8' }}>(double)</span> or add <span style={{ color: '#38bdf8' }}>.0</span> to keep the precision.
          </p>
        </div>
      </div>

      {/* Note 3: Modulo */}
      <div className="ipad-notes-container">
        <h3 className="handwritten-title">3. The Magic of Modulo (%)</h3>
        
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Fira Code, monospace', fontSize: '1.1rem' }}>
          <span style={{ color: '#a78bfa' }}>int</span> num = <span style={{ color: '#fbbf24' }}>10</span>;<br/>
          <span style={{ color: '#a78bfa' }}>int</span> remainder = num % <span style={{ color: '#fbbf24' }}>3</span>; <span className="handwritten handwritten-blue" style={{ marginLeft: '1rem' }}>&larr; 10 / 3 is 3... with 1 left over!</span><br/><br/>
          
          <span style={{ color: '#64748b' }}>// The Secret Weapon: Checking Even/Odd</span><br/>
          <span style={{ color: '#f472b6' }}>if</span> (num % <span style={{ color: '#fbbf24' }}>2</span> == <span style={{ color: '#fbbf24' }}>0</span>) &#123;<br/>
          &nbsp;&nbsp;cout &lt;&lt; <span style={{ color: '#34d399' }}>"Even number!"</span>;<br/>
          &#125;
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ArrowRight className="handwritten-pink" style={{ marginTop: '0.5rem', flexShrink: 0 }} />
          <p className="handwritten">
            Modulo gives you the REMAINDER of division. It is essential for determining if a number is even/odd or keeping a number within a certain limit!
          </p>
        </div>
      </div>

      {/* Note 4: The Getline Trap */}
      <div className="ipad-notes-container">
        <h3 className="handwritten-title">4. The `getline()` Trap</h3>
        <p className="handwritten" style={{ color: 'white', marginBottom: '1rem' }}>
          Ever tried to use <span style={{ color: '#38bdf8' }}>getline()</span> after a normal <span style={{ color: '#38bdf8' }}>cin</span>, and it completely skips the input? Here is why:
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* The Problem */}
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'Fira Code, monospace', fontSize: '1.1rem' }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>❌ The Problem</span>
            cout &lt;&lt; <span style={{ color: '#34d399' }}>"Enter age: "</span>;<br/>
            cin &gt;&gt; age; <span className="handwritten handwritten-pink" style={{ marginLeft: '1rem' }}>Leaves 'Enter' key in buffer!</span><br/><br/>
            
            cout &lt;&lt; <span style={{ color: '#34d399' }}>"Enter full name: "</span>;<br/>
            <span style={{ borderBottom: '2px dashed #ef4444' }}>getline(cin, name);</span> <span className="handwritten handwritten-pink" style={{ marginLeft: '0.5rem' }}>Skips immediately!</span>
          </div>

          {/* The Solution */}
          <div style={{ background: 'rgba(34,197,94,0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.3)', fontFamily: 'Fira Code, monospace', fontSize: '1.1rem', position: 'relative' }}>
            <span style={{ color: '#22c55e', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>✅ The Solution</span>
            cout &lt;&lt; <span style={{ color: '#34d399' }}>"Enter age: "</span>;<br/>
            cin &gt;&gt; age;<br/><br/>
            
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>cin.ignore();</span><br/><br/>

            cout &lt;&lt; <span style={{ color: '#34d399' }}>"Enter full name: "</span>;<br/>
            getline(cin, name);

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '5.5rem', left: '10rem' }}>
              <span className="handwritten handwritten-blue" style={{ marginBottom: '0.2rem', whiteSpace: 'nowrap' }}>Removes leftover 'Enter' key!</span>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 5 L20 30 M10 20 L20 30 L30 20" />
              </svg>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ArrowRight className="handwritten-pink" style={{ marginTop: '0.5rem', flexShrink: 0 }} />
          <p className="handwritten">
            Normal <span style={{ color: '#38bdf8' }}>cin</span> leaves the "Enter" key (newline character) floating in memory. When <span style={{ color: '#38bdf8' }}>getline()</span> comes along, it sees that leftover Enter key and thinks you instantly submitted a blank line! Always use <span style={{ color: '#fbbf24' }}>cin.ignore()</span> to clear the garbage first.
          </p>
        </div>
      </div>
      
    </div>
  );
}
