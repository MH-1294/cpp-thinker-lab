import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "Do I need prior coding experience to take this course?",
    answer: "Not at all! This course is designed from the ground up for absolute beginners. We start with the absolute basics of what a program is, and slowly build up to advanced C++ concepts."
  },
  {
    question: "How long do I have access to the Premium Course?",
    answer: "Once you purchase the Premium Course for a one-time fee of $19 CAD, you receive lifelong access. There are no recurring subscription fees, and you will automatically get access to any new modules or updates we add in the future."
  },
  {
    question: "Can I take the Assessment without buying the course?",
    answer: "Yes! The Assessment is completely free to take. You only need to create a free account so we can track your score on the Class Leaderboard."
  },
  {
    question: "Will I get a certificate when I finish?",
    answer: "Yes. Upon completing all modules in the Premium Course and passing the final Assessment, you will be awarded a digital Certificate of Completion."
  },
  {
    question: "What software do I need installed?",
    answer: "To start, you can use our built-in web Playground! However, as you progress, we recommend installing a local IDE like Visual Studio Code or CLion. We have a dedicated lesson on setting up your local environment."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="glass-panel text-center" style={{ marginBottom: '2rem', padding: '2.5rem' }}>
        <HelpCircle size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem auto' }} />
        <h1 className="text-gradient mb-2">Frequently Asked Questions</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Everything you need to know about the C++ Thinker Lab platform and our premium courses.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="glass-panel" 
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                border: isOpen ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: isOpen ? 'var(--accent-color)' : 'white', margin: 0 }}>
                  {faq.question}
                </h3>
                {isOpen ? <ChevronUp size={20} color="var(--accent-color)" /> : <ChevronDown size={20} color="#94a3b8" />}
              </div>
              
              {isOpen && (
                <div style={{ marginTop: '1rem', color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center" style={{ marginTop: '3rem' }}>
        <p style={{ color: '#94a3b8' }}>Still have questions?</p>
        <button 
          className="btn btn-secondary mt-2" 
          onClick={() => window.location.href = 'mailto:support@cppthinker.com'}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
