import React from 'react';

export default function NewcomerGuide() {
  return (
    <div className="glass-panel animate-fade-in">
      <h2 className="text-gradient mb-4" style={{ fontSize: '2.5rem' }}><span className="ali-highlight">A Newcomer's Guide</span> to Programming</h2>
      
      <div className="mb-4">
        <h3 className="mb-2">What is Programming?</h3>
        <p>
          At its core, programming is just giving a computer a set of instructions to follow. 
          Computers are incredibly fast, but they aren't smart. They need you (the programmer) 
          to break down problems into small, logical steps.
        </p>
      </div>

      <div className="mb-4">
        <h3 className="mb-2">Why C++?</h3>
        <p>
          C++ is a powerful, high-performance language. It's used everywhere—from operating systems 
          and game engines to financial systems. Learning C++ in CS:110 teaches you how a computer 
          actually manages memory and executes logic, making it easier to learn other languages later!
        </p>
      </div>

      <div className="mb-4">
        <h3 className="mb-2">The Basic Ingredients of Code</h3>
        <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li>
            <strong>Variables:</strong> Like boxes that store information. E.g., storing a player's score.
          </li>
          <li>
            <strong>Control Structures (If/Else):</strong> Making decisions. E.g., "If the score is over 100, you win."
          </li>
          <li>
            <strong>Loops:</strong> Doing things repeatedly without writing the same code over and over.
          </li>
          <li>
            <strong>Functions:</strong> Reusable blocks of code. Like a recipe you can call whenever you need to bake a cake.
          </li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="mb-2">Your First C++ Program</h3>
        <p>Here is what a basic C++ program looks like:</p>
        <pre>
<code>
{`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`}
</code>
        </pre>
        <p style={{ marginTop: '1rem' }}>
          Don't worry if this looks like alien text right now. Throughout this course, 
          you'll learn exactly what every single word means. The journey begins with small steps!
        </p>
      </div>
    </div>
  );
}
