import React, { useState } from 'react';
import { flashcards } from '../data/flashcards';

export default function Flashcards() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel mb-4" style={{ textAlign: 'center' }}>
        <h2 className="text-gradient"><span className="ali-highlight">Interactive Flashcards</span></h2>
        <p>Click on any card to flip it and reveal the definition. Great for quick memorization!</p>
      </div>

      <div className="flashcard-grid">
        {flashcards.map(card => (
          <div 
            key={card.id} 
            className={`flashcard ${flippedCards[card.id] ? 'flipped' : ''}`}
            onClick={() => toggleFlip(card.id)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                {card.term}
              </div>
              <div className="flashcard-back">
                {card.definition}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
