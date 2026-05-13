import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function ChatWidget({ userId, userName, setUserName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  const welcomeMessage = {
    text: "Hi! I'm the instructor. Let me know if you need any help with C++!",
    sender: "instructor",
    timestamp: 0,
  };

  useEffect(() => {
    if (!db || !userId) return;

    const chatRef = doc(db, 'chats', userId);
    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages || []);
        
        // If chat is closed and there's a new message from instructor, show unread badge
        if (!isOpen && data.hasUnreadInstructorMessage) {
          setHasUnread(true);
        }
      }
    });

    return () => unsubscribe();
  }, [userId, isOpen]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      
      // Clear unread badge when opened
      if (hasUnread) {
        setHasUnread(false);
        if (db && userId && messages.length > 0) {
          updateDoc(doc(db, 'chats', userId), { hasUnreadInstructorMessage: false }).catch(console.error);
        }
      }
    }
  }, [isOpen, messages, hasUnread, userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;
    
    if (!userName) {
      if (!nicknameInput.trim()) {
        alert("Please enter a nickname first!");
        return;
      }
      setUserName(nicknameInput.trim());
    }

    const currentUserName = userName || nicknameInput.trim();
    const messageObj = {
      text: newMessage.trim(),
      sender: 'student',
      timestamp: Date.now()
    };

    setNewMessage('');

    try {
      const chatRef = doc(db, 'chats', userId);
      // We use setDoc with merge: true to create the document if it doesn't exist
      await setDoc(chatRef, {
        studentId: userId,
        studentName: currentUserName,
        lastMessageAt: Date.now(),
        hasUnreadStudentMessage: true,
        messages: arrayUnion(messageObj)
      }, { merge: true });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please ensure Firebase is connected.");
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-color)',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 9999,
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
          {hasUnread && (
            <span style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }}></span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '350px',
            height: '500px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: 0
          }}
        >
          {/* Header */}
          <div style={{ background: 'var(--accent-color)', color: '#0f172a', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <MessageCircle size={20} /> Instructor Chat
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Setup Nickname (if not logged in) */}
          {!userName && messages.length === 0 && (
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Enter your name to start..." 
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          )}

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Always show welcome message */}
            <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.75rem 1rem', borderRadius: '12px', borderTopLeftRadius: '2px', color: 'white', fontSize: '0.9rem' }}>
                {welcomeMessage.text}
              </div>
            </div>

            {messages.map((msg, idx) => {
              const isStudent = msg.sender === 'student';
              return (
                <div key={idx} style={{ alignSelf: isStudent ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.2rem', textAlign: isStudent ? 'right' : 'left' }}>
                    {isStudent ? 'You' : 'Instructor'}
                  </div>
                  <div style={{ 
                    background: isStudent ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', 
                    color: isStudent ? '#0f172a' : 'white', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    borderTopRightRadius: isStudent ? '2px' : '12px',
                    borderTopLeftRadius: isStudent ? '12px' : '2px',
                    fontSize: '0.9rem',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
            <input 
              type="text" 
              placeholder={(!userName && messages.length === 0) ? "Set name above first..." : "Type a question..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!userName && messages.length === 0 && !nicknameInput.trim()}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim() || (!userName && messages.length === 0 && !nicknameInput.trim())}
              style={{ background: 'var(--accent-color)', border: 'none', width: '45px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', cursor: 'pointer', opacity: !newMessage.trim() ? 0.5 : 1 }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
