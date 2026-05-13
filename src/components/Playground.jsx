import React, { useState } from 'react';
import { Play, Code, TerminalSquare, Send, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Playground({ contestContext }) {
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello champions!" << endl;\n    // Type your code here\n    \n    return 0;\n}');
  const [inputData, setInputData] = useState('// Enter your custom input here\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [judgeResult, setJudgeResult] = useState(null);

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

  const handleSubmit = async () => {
    if (!contestContext || isSubmitting) return;
    setIsSubmitting(true);
    setJudgeResult(null);
    setOutput('Grading solution in the cloud...\n');
    
    try {
      const problem = contestContext.problemDetails;
      const expectedInput = problem?.sampleInput || inputData;
      const expectedOutput = problem?.sampleOutput || '';

      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          compiler: 'gcc-head',
          stdin: expectedInput
        })
      });

      const data = await response.json();
      
      let status = '';
      let percentage = 100;
      let errorDetails = '';
      let finalOutput = '';

      if (data.compiler_error) {
        status = 'Compilation Error';
        errorDetails = data.compiler_error;
        finalOutput = `[COMPILER ERROR]\n${data.compiler_error}`;
      } else if (data.program_error) {
        status = 'Runtime Error';
        errorDetails = data.program_error;
        finalOutput = `[RUNTIME ERROR]\n${data.program_error}`;
      } else {
        const actualOutput = (data.program_output || '').trim();
        const targetOutput = expectedOutput.trim();
        finalOutput = actualOutput;

        if (actualOutput === targetOutput) {
          status = 'Accepted';
          percentage = 0;
        } else {
          status = 'Wrong Answer';
          // Calculate character matching percentage
          const maxLength = Math.max(actualOutput.length, targetOutput.length);
          let matchCount = 0;
          for (let i = 0; i < Math.min(actualOutput.length, targetOutput.length); i++) {
            if (actualOutput[i] === targetOutput[i]) matchCount++;
          }
          percentage = maxLength === 0 ? 100 : Math.round(((maxLength - matchCount) / maxLength) * 100);
          errorDetails = `Expected Output:\n${targetOutput}\n\nYour Output:\n${actualOutput}`;
        }
      }

      setJudgeResult({ status, percentage, errorDetails });
      setOutput(`$ ./main < test_case.in\n${finalOutput}\n\n[Judge Result: ${status}]`);

      if (db) {
        await addDoc(collection(db, 'contest_submissions'), {
          contestId: contestContext.contestId,
          problemId: contestContext.problemId,
          userId: contestContext.userId,
          userName: contestContext.userName || 'Anonymous Student',
          teamName: contestContext.teamName || '',
          code: code,
          status: status === 'Accepted' ? 'solved' : 'failed',
          judgeStatus: status,
          rejectionPercentage: percentage,
          timestamp: Date.now()
        });
        if (status === 'Accepted') {
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 3000);
        }
      }
    } catch (e) {
      console.error("Error submitting solution:", e);
      alert("Failed to evaluate solution. Please check your connection.");
      setOutput(`Grading Error: ${e.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">C++ Cloud Compiler</span></h2>
        <p>Write your C++ code, provide standard input (cin), and run it against a real GCC compiler!</p>
      </div>

      {judgeResult && (
        <div className={`glass-panel mb-4 animate-fade-in`} style={{ borderColor: judgeResult.status === 'Accepted' ? 'var(--success-color)' : '#f87171', borderWidth: '2px', borderStyle: 'solid' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: judgeResult.status === 'Accepted' ? '0' : '1rem' }}>
            {judgeResult.status === 'Accepted' ? <CheckCircle size={28} color="var(--success-color)" /> : <XCircle size={28} color="#f87171" />}
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: judgeResult.status === 'Accepted' ? 'var(--success-color)' : '#f87171' }}>
              {judgeResult.status}
            </h3>
          </div>
          {judgeResult.status !== 'Accepted' && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                Rejection Rate: {judgeResult.percentage}%
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                {judgeResult.errorDetails}
              </pre>
            </div>
          )}
        </div>
      )}

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

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={handleRun} disabled={isRunning} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem' }}>
              <Play size={18} /> {isRunning ? 'Running...' : 'Run Code'}
            </button>
            {contestContext && (
              <button 
                className="btn" 
                onClick={handleSubmit} 
                disabled={isSubmitting || isSubmitted} 
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: isSubmitted ? 'var(--success-color)' : 'var(--accent-color)' }}
              >
                {isSubmitted ? <><CheckCircle size={18} /> Submitted!</> : <><Send size={18} /> Submit Solution</>}
              </button>
            )}
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
