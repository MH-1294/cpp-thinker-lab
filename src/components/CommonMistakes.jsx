import React from 'react';
import { AlertCircle, FileWarning, HelpCircle, Edit3, Type } from 'lucide-react';

export default function CommonMistakes() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">Common C++ Mistakes</span></h2>
        <p>A quick guide to the most frequent errors beginners make and how to fix them.</p>
      </div>

      <div className="glass-panel mb-4">
        <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error-color)' }}>
          <AlertCircle size={24} /> Missing Semicolons
        </h3>
        <p className="mb-2">
          <strong>The Mistake:</strong> Forgetting to end a statement with a semicolon <code>;</code>.
        </p>
        <pre>
          <code>
{`int main() {
    cout << "Hello World" // Missing semicolon!
    return 0;
}`}
          </code>
        </pre>
        <p style={{ marginTop: '0.5rem' }}><strong>The Fix:</strong> Always ensure your statements (except loops and if-statements) end with a semicolon.</p>
      </div>

      <div className="glass-panel mb-4">
        <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
          <HelpCircle size={24} /> Assignment vs. Equality
        </h3>
        <p className="mb-2">
          <strong>The Mistake:</strong> Using <code>=</code> (assignment) instead of <code>==</code> (equality check) inside an if-statement.
        </p>
        <pre>
          <code>
{`int score = 50;
if (score = 100) { // This SETS score to 100, and is always true!
    cout << "Perfect score!";
}`}
          </code>
        </pre>
        <p style={{ marginTop: '0.5rem' }}><strong>The Fix:</strong> Use double equals <code>==</code> when comparing values.</p>
      </div>

      <div className="glass-panel mb-4">
        <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
          <FileWarning size={24} /> Array Out of Bounds
        </h3>
        <p className="mb-2">
          <strong>The Mistake:</strong> Trying to access an array index that doesn't exist. Arrays in C++ are 0-indexed!
        </p>
        <pre>
          <code>
{`int numbers[3] = {10, 20, 30};
cout << numbers[3]; // Error! Valid indexes are 0, 1, 2`}
          </code>
        </pre>
        <p style={{ marginTop: '0.5rem' }}><strong>The Fix:</strong> Always ensure your loop counters or index variables are strictly less than the array's size.</p>
      </div>
      <div className="glass-panel mb-4">
        <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
          <Edit3 size={24} /> Overwriting User Input
        </h3>
        <p className="mb-2">
          <strong>The Mistake:</strong> Reading a value from the user using <code>cin</code>, but then immediately assigning a hardcoded value to that same variable.
        </p>
        <pre>
          <code>
{`int age;
cin >> age; // User types 20
age = 5; // The user's input is destroyed and replaced with 5!`}
          </code>
        </pre>
        <p style={{ marginTop: '0.5rem' }}><strong>The Fix:</strong> Once you read a value using <code>cin</code>, do not assign a new value to it using <code>=</code> unless you intentionally want to erase what the user typed.</p>
      </div>

      <div className="glass-panel mb-4">
        <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc' }}>
          <Type size={24} /> Invalid Variable Naming
        </h3>
        <p className="mb-2">
          <strong>The Mistake:</strong> Using spaces in variable names or starting them with a number.
        </p>
        <pre>
          <code>
{`int 1stNumber = 10; // Error: Cannot start with a number
int my age = 20;    // Error: Cannot contain spaces`}
          </code>
        </pre>
        <p style={{ marginTop: '0.5rem' }}><strong>The Fix:</strong> Use <code>camelCase</code> (e.g., <code>myAge</code>) or <code>snake_case</code> (e.g., <code>first_number</code>). Variable names must start with a letter or an underscore.</p>
      </div>
    </div>
  );
}
