import React, { useState } from 'react';
import { Play, Code, TerminalSquare } from 'lucide-react';

export default function Playground() {
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    int A, B;\n    // Type your code here\n    cin >> A >> B;\n    cout << "X = " << A + B << endl;\n    return 0;\n}');
  const [inputData, setInputData] = useState('10\n9');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and running in the cloud...\n');

    try {
      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          compiler: 'gcc-head',
          stdin: inputData
        })
      });

      const data = await response.json();
      
      let finalOutput = '';
      if (data.compiler_error) {
        finalOutput += `[COMPILER ERROR]\n${data.compiler_error}\n`;
      }
      if (data.program_error) {
        finalOutput += `[RUNTIME ERROR]\n${data.program_error}\n`;
      }
      if (data.program_output) {
        finalOutput += `${data.program_output}`;
      }
      if (!data.program_output && !data.compiler_error && !data.program_error) {
         finalOutput += `[Process exited successfully with no output]`;
      }

      setOutput(`$ ./main\n${finalOutput}\n\n[Process exited ${data.status}]`);
    } catch (error) {
      setOutput(`Error connecting to compiler API: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">C++ Cloud Compiler</span></h2>
        <p>Write your C++ code, provide standard input (cin), and run it against a real GCC compiler!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Code Editor */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} color="var(--accent-color)" />
            <strong style={{ fontSize: '0.9rem' }}>Source Code (main.cpp)</strong>
          </div>
          <textarea
            className="editor-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{ flex: 1, minHeight: '350px', border: 'none', borderRadius: '0' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Input Data */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', flex: '0 0 auto' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong style={{ fontSize: '0.9rem', color: '#fbbf24' }}>Standard Input (stdin)</strong>
            </div>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter input data here (e.g. 10 9)"
              spellCheck="false"
              style={{ 
                width: '100%', 
                height: '100px', 
                padding: '1rem', 
                background: 'rgba(0,0,0,0.3)', 
                border: 'none', 
                color: '#e2e8f0',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn" onClick={handleRun} disabled={isRunning} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}>
              <Play size={20} /> {isRunning ? 'Compiling...' : 'Run Code'}
            </button>
          </div>

          {/* Terminal Output */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem 1rem', background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TerminalSquare size={18} color="#94a3b8" />
              <strong style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Terminal Output</strong>
            </div>
            <div className="terminal-output" style={{ border: 'none', borderRadius: '0', margin: '0', flex: 1, minHeight: '150px' }}>
              {output || '> Output will appear here...'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
