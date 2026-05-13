import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Settings, Upload, Bot, Copy, FileCode2, HelpCircle, Video, Users, PlayCircle, Edit, Eye, EyeOff, Loader, Trophy, Calendar, Clock, MessageCircle, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, orderBy, query, onSnapshot, arrayUnion } from 'firebase/firestore';
import { problems as staticProblems } from '../data/problems';

export default function AdminPanel({ onPreview }) {
  const [userRole, setUserRole] = useState('superadmin');
  const [activeTab, setActiveTab] = useState('quiz');

  // --- QUIZ STATE ---
  const [question, setQuestion] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [customQuestions, setCustomQuestions] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [bulkJSON, setBulkJSON] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  // --- PROBLEM STATE ---
  const [probTitle, setProbTitle] = useState('');
  const [probSource, setProbSource] = useState('Custom');
  const [probDesc, setProbDesc] = useState('');
  const [probInput, setProbInput] = useState('');
  const [probOutput, setProbOutput] = useState('');
  const [probSampleIn, setProbSampleIn] = useState('');
  const [probSampleOut, setProbSampleOut] = useState('');
  const [firestoreProblems, setFirestoreProblems] = useState([]);
  const [isProbSaved, setIsProbSaved] = useState(false);
  const [probLoading, setProbLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [bulkProbJSON, setBulkProbJSON] = useState('');
  const [bulkProbMessage, setBulkProbMessage] = useState('');

  // --- COURSE STATE ---
  const [lessonIdToEdit, setLessonIdToEdit] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [customLessons, setCustomLessons] = useState([]);
  const [isLessonSaved, setIsLessonSaved] = useState(false);

  // --- RBAC STATE ---
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('quiz_manager');
  const [staffList, setStaffList] = useState([]);
  const [isStaffSaved, setIsStaffSaved] = useState(false);
  
  // --- CONTEST STATE ---
  const [contestTitle, setContestTitle] = useState('');
  const [contestDesc, setContestDesc] = useState('');
  const [contestStart, setContestStart] = useState('');
  const [contestDuration, setContestDuration] = useState('2'); // hours
  const [contestEnd, setContestEnd] = useState('');
  const [contestType, setContestType] = useState('individual');
  const [maxTeamSize, setMaxTeamSize] = useState('3');
  const [selectedProbIds, setSelectedProbIds] = useState([]);
  const [firestoreContests, setFirestoreContests] = useState([]);
  const [isContestSaved, setIsContestSaved] = useState(false);
  const [contestLoading, setContestLoading] = useState(false);

  // --- INBOX STATE ---
  const [inboxChats, setInboxChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // --- LIFECYCLE ---
  useEffect(() => {
    const role = localStorage.getItem('cs110_role') || 'student';
    setUserRole(role);
    // If not superadmin, ensure active tab is allowed
    if (role !== 'superadmin' && (activeTab === 'course' || activeTab === 'staff')) {
      setActiveTab('quiz');
    }

    const savedQ = localStorage.getItem('cs110_custom_mcq');
    if (savedQ) setCustomQuestions(JSON.parse(savedQ));

    const settings = localStorage.getItem('cs110_quiz_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setNumQuestions(parsed.numQuestions ?? 5);
      setShuffleQuestions(parsed.shuffleQuestions ?? true);
      setShuffleOptions(parsed.shuffleOptions ?? true);
    }

    fetchFirestoreProblems();

    const savedC = localStorage.getItem('cs110_custom_course');
    if (savedC) setCustomLessons(JSON.parse(savedC));

    const savedS = localStorage.getItem('cs110_staff');
    if (savedS) setStaffList(JSON.parse(savedS));

    fetchFirestoreContests();

    // Inbox listener
    let unsubInbox = () => {};
    if (db && role === 'superadmin') {
      const q = query(collection(db, 'chats'), orderBy('lastMessageAt', 'desc'));
      unsubInbox = onSnapshot(q, (snap) => {
        setInboxChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    return () => unsubInbox();
  }, [userRole]);

  // --- QUIZ HANDLERS ---
  const saveSettings = (updates) => {
    const newSettings = { numQuestions, shuffleQuestions, shuffleOptions, ...updates };
    localStorage.setItem('cs110_quiz_settings', JSON.stringify(newSettings));
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!question || !opt0 || !opt1 || !opt2 || !opt3 || !explanation) {
      alert("Please fill in all fields!");
      return;
    }
    const newQ = { id: Date.now(), type: "mcq", question, options: [opt0, opt1, opt2, opt3], correctAnswer: parseInt(correctAnswer, 10), explanation };
    const updatedList = [...customQuestions, newQ];
    setCustomQuestions(updatedList);
    localStorage.setItem('cs110_custom_mcq', JSON.stringify(updatedList));
    setQuestion(''); setOpt0(''); setOpt1(''); setOpt2(''); setOpt3(''); setExplanation(''); setCorrectAnswer(0);
    setIsSaved(true); setTimeout(() => setIsSaved(false), 3000);
  };

  const handleQuizBulk = () => {
    try {
      const parsed = JSON.parse(bulkJSON);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of objects.");
      const validated = parsed.map(q => ({
        id: Date.now() + Math.random(), type: "mcq", question: q.question || "Missing question text",
        options: q.options || ["A", "B", "C", "D"], correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0, explanation: q.explanation || "No explanation provided."
      }));
      const updatedList = [...customQuestions, ...validated];
      setCustomQuestions(updatedList); localStorage.setItem('cs110_custom_mcq', JSON.stringify(updatedList));
      setBulkJSON(''); setBulkMessage(`Successfully imported ${validated.length} questions!`); setTimeout(() => setBulkMessage(''), 3000);
    } catch (e) {
      setBulkMessage(`Error: ${e.message}`); setTimeout(() => setBulkMessage(''), 4000);
    }
  };

  const handleQuizDelete = (id) => {
    if (window.confirm("Delete this custom question?")) {
      const updatedList = customQuestions.filter(q => q.id !== id);
      setCustomQuestions(updatedList); localStorage.setItem('cs110_custom_mcq', JSON.stringify(updatedList));
    }
  };

  const copyQuizPrompt = () => {
    navigator.clipboard.writeText(`Please generate 5 multiple choice questions for a beginner C++ programming course. \nOutput exactly as a raw JSON array format: \n[{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}]`);
    alert("AI Prompt copied to clipboard!");
  };

  // --- PROBLEM HANDLERS ---
  const fetchFirestoreProblems = async () => {
    if (!db) return;
    setProbLoading(true);
    try {
      const q = query(collection(db, 'problems'), orderBy('createdAt', 'asc'));
      const snap = await getDocs(q);
      setFirestoreProblems(snap.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setProbLoading(false);
  };

  const handleProbSubmit = async (e) => {
    e.preventDefault();
    if (!probTitle || !probDesc || !probInput || !probOutput) {
      alert('Please fill in Title, Description, Input, and Output!'); return;
    }
    const newP = { title: probTitle, source: probSource, description: probDesc, input: probInput, output: probOutput, sampleInput: probSampleIn, sampleOutput: probSampleOut, isVisible: true, createdAt: Date.now() };
    if (db) {
      await addDoc(collection(db, 'problems'), newP);
      await fetchFirestoreProblems();
    }
    setProbTitle(''); setProbSource('Custom'); setProbDesc(''); setProbInput(''); setProbOutput(''); setProbSampleIn(''); setProbSampleOut('');
    setIsProbSaved(true); setTimeout(() => setIsProbSaved(false), 3000);
  };

  const handleProbDelete = async (firestoreId) => {
    if (!window.confirm('Delete this problem?')) return;
    if (db) {
      await deleteDoc(doc(db, 'problems', firestoreId));
      setFirestoreProblems(prev => prev.filter(p => p.firestoreId !== firestoreId));
    }
  };

  const handleToggleVisibility = async (problem) => {
    if (!db) return;
    const ref = doc(db, 'problems', problem.firestoreId);
    const newVal = !problem.isVisible;
    await updateDoc(ref, { isVisible: newVal });
    setFirestoreProblems(prev => prev.map(p => p.firestoreId === problem.firestoreId ? { ...p, isVisible: newVal } : p));
  };

  const handleSeedProblems = async () => {
    if (!db) { setSeedMessage('Firebase not connected.'); return; }
    setSeedMessage('Seeding...');
    for (const p of staticProblems) {
      await addDoc(collection(db, 'problems'), { ...p, isVisible: true, createdAt: Date.now() });
    }
    await fetchFirestoreProblems();
    setSeedMessage(`Seeded ${staticProblems.length} problems!`);
    setTimeout(() => setSeedMessage(''), 4000);
  };

  const handleBulkProbImport = async () => {
    if (!bulkProbJSON.trim()) return;
    try {
      const parsed = JSON.parse(bulkProbJSON);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array [ ... ]');
      if (!db) throw new Error('Firebase not connected.');
      for (const p of parsed) {
        await addDoc(collection(db, 'problems'), {
          title: p.title || 'Untitled Problem',
          source: p.source || 'AI Generated',
          description: p.description || '',
          input: p.input || '',
          output: p.output || '',
          sampleInput: p.sampleInput || '',
          sampleOutput: p.sampleOutput || '',
          isVisible: true,
          createdAt: Date.now()
        });
      }
      await fetchFirestoreProblems();
      setBulkProbJSON('');
      setBulkProbMessage(`✓ Imported ${parsed.length} problems successfully!`);
    } catch (e) {
      setBulkProbMessage(`Error: ${e.message}`);
    }
    setTimeout(() => setBulkProbMessage(''), 4000);
  };

  const copyProbPrompt = () => {
    navigator.clipboard.writeText(`Please generate 3 scenario-based competitive programming challenges suitable for a beginner C++ course. \nOutput exactly as a raw JSON array format: \n[{"title": "...", "source": "AI Scenario", "description": "...", "input": "...", "output": "...", "sampleInput": "...", "sampleOutput": "..."}]`);
    alert('AI Prompt copied!');
  };

  // --- COURSE HANDLERS ---
  const handleLessonSubmit = (e) => {
    e.preventDefault();
    if (!lessonTitle || !lessonDuration) {
      alert("Title and duration are required!"); return;
    }
    
    let updatedList;
    if (lessonIdToEdit) {
      // Update existing lesson
      updatedList = customLessons.map(l => {
        if (l.id === lessonIdToEdit) {
          return { ...l, title: lessonTitle, duration: lessonDuration, videoUrl: lessonVideo, description: lessonDesc, locked: !isFreePreview };
        }
        return l;
      });
      setLessonIdToEdit(null); // Exit edit mode
    } else {
      // Add new lesson
      const newL = {
        id: "lesson-" + Date.now(),
        title: lessonTitle,
        duration: lessonDuration,
        videoUrl: lessonVideo,
        description: lessonDesc,
        locked: !isFreePreview,
        completed: false
      };
      updatedList = [...customLessons, newL];
    }
    
    setCustomLessons(updatedList);
    localStorage.setItem('cs110_custom_course', JSON.stringify(updatedList));
    
    // Clear form
    setLessonTitle(''); setLessonDuration(''); setLessonVideo(''); setLessonDesc(''); setIsFreePreview(false);
    setIsLessonSaved(true); setTimeout(() => setIsLessonSaved(false), 3000);
  };

  const startEditLesson = (lesson) => {
    setLessonIdToEdit(lesson.id);
    setLessonTitle(lesson.title);
    setLessonDuration(lesson.duration);
    setLessonVideo(lesson.videoUrl || '');
    setLessonDesc(lesson.description || '');
    setIsFreePreview(!lesson.locked);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditLesson = () => {
    setLessonIdToEdit(null);
    setLessonTitle(''); setLessonDuration(''); setLessonVideo(''); setLessonDesc(''); setIsFreePreview(false);
  };

  const handleLessonDelete = (id) => {
    if (window.confirm("Delete this custom lesson?")) {
      const updatedList = customLessons.filter(l => l.id !== id);
      setCustomLessons(updatedList); localStorage.setItem('cs110_custom_course', JSON.stringify(updatedList));
      if (lessonIdToEdit === id) cancelEditLesson();
    }
  };

  // --- STAFF HANDLERS ---
  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffEmail) return;
    const newStaff = { id: Date.now(), email: staffEmail, role: staffRole };
    const updated = [...staffList, newStaff];
    setStaffList(updated);
    localStorage.setItem('cs110_staff', JSON.stringify(updated));
    setStaffEmail('');
    setIsStaffSaved(true); setTimeout(() => setIsStaffSaved(false), 3000);
  };

  const handleStaffDelete = (id) => {
    if (window.confirm("Remove this staff member?")) {
      const updated = staffList.filter(s => s.id !== id);
      setStaffList(updated); localStorage.setItem('cs110_staff', JSON.stringify(updated));
    }
  };

  // --- CONTEST HANDLERS ---
  const fetchFirestoreContests = async () => {
    if (!db) return;
    setContestLoading(true);
    try {
      const q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setFirestoreContests(snap.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setContestLoading(false);
  };

  const handleContestSubmit = async (e) => {
    e.preventDefault();
    const isTimeValid = contestEnd || (contestStart && contestDuration && contestDuration !== 'custom');
    if (!contestTitle || !contestStart || !isTimeValid || selectedProbIds.length === 0) {
      alert('Please fill in Title, Start/End time, and select at least one problem!');
      return;
    }
    let finalEndTime = contestEnd;
    if (!finalEndTime && contestStart && contestDuration && contestDuration !== 'custom') {
      const start = new Date(contestStart);
      if (!isNaN(start.getTime())) {
        start.setHours(start.getHours() + parseInt(contestDuration));
        finalEndTime = start.toISOString().slice(0, 16);
      }
    }

    const newContest = {
      title: contestTitle,
      description: contestDesc,
      startTime: contestStart,
      endTime: finalEndTime,
      type: contestType,
      maxTeamSize: contestType === 'group' ? parseInt(maxTeamSize) : 1,
      problemIds: selectedProbIds,
      createdAt: Date.now(),
      status: 'active'
    };
    if (db) {
      await addDoc(collection(db, 'contests'), newContest);
      await fetchFirestoreContests();
    }
    setContestTitle(''); setContestDesc(''); setContestStart(''); setContestEnd(''); setSelectedProbIds([]);
    setIsContestSaved(true); setTimeout(() => setIsContestSaved(false), 3000);
  };

  const handleContestDelete = async (id) => {
    if (!window.confirm('Delete this contest?')) return;
    if (db) {
      await deleteDoc(doc(db, 'contests', id));
      setFirestoreContests(prev => prev.filter(c => c.firestoreId !== id));
    }
  };

  const toggleProblemSelection = (id) => {
    setSelectedProbIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  // --- INBOX HANDLERS ---
  const handleReplyToStudent = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId || !db) return;
    try {
      const msg = {
        text: replyText.trim(),
        sender: 'instructor',
        timestamp: Date.now()
      };
      await updateDoc(doc(db, 'chats', selectedChatId), {
        messages: arrayUnion(msg),
        lastMessageAt: Date.now(),
        hasUnreadInstructorMessage: true,
        hasUnreadStudentMessage: false
      });
      setReplyText('');
    } catch(err) {
      console.error(err);
    }
  };


  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
        <h2 className="text-gradient mb-2"><span className="ali-highlight">Instructor Dashboard</span></h2>
        
        {/* TABS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className={`btn ${activeTab === 'quiz' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('quiz')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'quiz' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)' }}>
            <HelpCircle size={18} /> Manage Quiz
          </button>
          <button className={`btn ${activeTab === 'problems' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('problems')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'problems' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)' }}>
            <FileCode2 size={18} /> Manage Problems
          </button>
          <button className={`btn ${activeTab === 'contests' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('contests')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'contests' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)' }}>
            <Trophy size={18} /> Manage Contests
          </button>
          {userRole === 'superadmin' && (
            <>
              <button className={`btn ${activeTab === 'course' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('course')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'course' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)' }}>
                <Video size={18} /> Manage Course
              </button>
              <button className={`btn ${activeTab === 'staff' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('staff')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'staff' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)' }}>
                <Users size={18} /> Manage Staff
              </button>
              <button className={`btn ${activeTab === 'inbox' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('inbox')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'inbox' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)' }}>
                <MessageCircle size={18} /> Student Inbox
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'quiz' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Global Quiz Settings */}
          <div className="glass-panel" style={{ border: '1px solid var(--accent-color)' }}>
            <h3 className="mb-4" style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={24} /> Global Quiz Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Questions per Quiz</label>
                <input type="number" value={numQuestions} onChange={(e) => { const val = parseInt(e.target.value, 10) || 5; setNumQuestions(val); saveSettings({ numQuestions: val }); }} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Shuffle Questions</label>
                <select value={shuffleQuestions.toString()} onChange={(e) => { const val = e.target.value === 'true'; setShuffleQuestions(val); saveSettings({ shuffleQuestions: val }); }} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="true">Yes</option><option value="false">No</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Shuffle Options</label>
                <select value={shuffleOptions.toString()} onChange={(e) => { const val = e.target.value === 'true'; setShuffleOptions(val); saveSettings({ shuffleOptions: val }); }} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="true">Yes</option><option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel">
              <h3 className="mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={20} /> Add Manual MCQ</h3>
              <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question text..." style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white' }} rows="2" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input type="text" placeholder="Opt 0" value={opt0} onChange={(e) => setOpt0(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                  <input type="text" placeholder="Opt 1" value={opt1} onChange={(e) => setOpt1(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                  <input type="text" placeholder="Opt 2" value={opt2} onChange={(e) => setOpt2(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                  <input type="text" placeholder="Opt 3" value={opt3} onChange={(e) => setOpt3(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                </div>
                <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#1e293b', color: 'white' }}>
                  <option value={0}>Correct: Opt 0</option><option value={1}>Correct: Opt 1</option><option value={2}>Correct: Opt 2</option><option value={3}>Correct: Opt 3</option>
                </select>
                <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Explanation..." style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white' }} rows="1" />
                <button type="submit" className="btn btn-secondary" style={{ background: isSaved ? 'var(--success-color)' : 'rgba(255,255,255,0.1)' }}>{isSaved ? 'Saved!' : 'Add Manually'}</button>
              </form>
            </div>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="mb-2" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={20} /> AI JSON Import</h3>
              <button onClick={copyQuizPrompt} className="btn mb-4" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Bot size={18} /> Copy Prompt for ChatGPT <Copy size={14} />
              </button>
              <textarea value={bulkJSON} onChange={(e) => setBulkJSON(e.target.value)} placeholder="[ { &quot;question&quot;: ... } ]" style={{ flex: 1, minHeight: '150px', width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.4)', color: '#10b981', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.1)' }} />
              {bulkMessage && <div style={{ color: bulkMessage.includes('Error') ? '#f87171' : '#34d399', fontSize: '0.9rem', margin: '0.5rem 0' }}>{bulkMessage}</div>}
              <button onClick={handleQuizBulk} className="btn" style={{ background: '#fbbf24', color: '#0f172a', fontWeight: 'bold' }}>Import JSON Array</button>
            </div>
          </div>
          {customQuestions.length > 0 && (
            <div className="glass-panel">
              <h3 className="mb-4" style={{ color: 'white' }}>Custom Question Bank ({customQuestions.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {customQuestions.map(q => (
                  <div key={q.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--accent-color)' }}>{q.question}</strong>
                    <button onClick={() => handleQuizDelete(q.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Seed + Add Form row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel">
              <h3 className="mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={20} /> Add New Problem</h3>
              <form onSubmit={handleProbSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                  <input type="text" placeholder="Problem Title" value={probTitle} onChange={(e) => setProbTitle(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <input type="text" placeholder="Source" value={probSource} onChange={(e) => setProbSource(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
                <textarea placeholder="Problem Description..." value={probDesc} onChange={(e) => setProbDesc(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} rows="3" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <textarea placeholder="Input Format..." value={probInput} onChange={(e) => setProbInput(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} rows="2" />
                  <textarea placeholder="Output Format..." value={probOutput} onChange={(e) => setProbOutput(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} rows="2" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <textarea placeholder="Sample Input..." value={probSampleIn} onChange={(e) => setProbSampleIn(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'monospace', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} rows="2" />
                  <textarea placeholder="Sample Output..." value={probSampleOut} onChange={(e) => setProbSampleOut(e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'monospace', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} rows="2" />
                </div>
                <button type="submit" className="btn" style={{ background: isProbSaved ? 'var(--success-color)' : 'var(--accent-color)', color: '#0f172a', fontWeight: 'bold' }}>{isProbSaved ? '✓ Saved to Database!' : 'Add to Database'}</button>
              </form>
            </div>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '10px' }}>
                <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={18} /> Seed Initial Problems</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>Upload the built-in classic problems to Firebase. Only run this once to populate your database for the first time.</p>
                <button onClick={handleSeedProblems} className="btn" style={{ width: '100%', background: '#fbbf24', color: '#0f172a', fontWeight: 'bold' }}>Seed {staticProblems.length} Classic Problems</button>
                {seedMessage && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: seedMessage.includes('error') || seedMessage.includes('not') ? '#f87171' : '#34d399' }}>{seedMessage}</div>}
              </div>
              <div style={{ padding: '1rem', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px' }}>
                <h4 style={{ color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bot size={18} /> AI Prompt</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>1. Copy this prompt → paste into ChatGPT → copy the JSON result → paste below.</p>
                <button onClick={copyProbPrompt} className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}><Copy size={14} /> Copy AI Prompt</button>
                <textarea
                  value={bulkProbJSON}
                  onChange={(e) => setBulkProbJSON(e.target.value)}
                  placeholder='Paste the JSON array from ChatGPT here... [ { "title": "...", "description": "..." } ]'
                  rows="5"
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.4)', color: '#10b981', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', resize: 'vertical' }}
                />
                {bulkProbMessage && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: bulkProbMessage.includes('Error') ? '#f87171' : '#34d399' }}>{bulkProbMessage}</div>}
                <button onClick={handleBulkProbImport} className="btn" style={{ width: '100%', marginTop: '0.5rem', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}>Import to Database</button>
              </div>
            </div>
          </div>

          {/* Live Problem List with Visibility Toggles */}
          <div className="glass-panel">
            <h3 className="mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode2 size={20} /> Problem Bank ({firestoreProblems.length})
              {probLoading && <Loader size={16} style={{ animation: 'spin 1s linear infinite', color: '#94a3b8' }} />}
            </h3>
            {!db ? (
              <p style={{ color: '#f87171', fontSize: '0.9rem' }}>⚠ Firebase not connected. Add your API keys to enable the database.</p>
            ) : firestoreProblems.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No problems in the database yet. Use "Seed Initial Problems" above to get started!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {firestoreProblems.map(p => (
                  <div key={p.firestoreId} style={{ padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: `1px solid ${p.isVisible ? 'rgba(56,189,248,0.15)' : 'rgba(248,113,113,0.2)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', opacity: p.isVisible ? 1 : 0.6 }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: p.isVisible ? 'var(--accent-color)' : '#94a3b8' }}>{p.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Source: {p.source}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <button
                        onClick={() => handleToggleVisibility(p)}
                        title={p.isVisible ? 'Hide from students' : 'Show to students'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderRadius: '20px', border: `1px solid ${p.isVisible ? 'rgba(56,189,248,0.4)' : 'rgba(248,113,113,0.4)'}`, background: p.isVisible ? 'rgba(56,189,248,0.1)' : 'rgba(248,113,113,0.1)', color: p.isVisible ? '#38bdf8' : '#f87171', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                      >
                        {p.isVisible ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                      <button onClick={() => handleProbDelete(p.firestoreId)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.25rem' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'course' && userRole === 'superadmin' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Action Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', margin: 0 }}>Course Editor</h3>
            <button onClick={onPreview} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#38bdf8', color: '#0f172a' }}>
              <PlayCircle size={18} /> Preview as Student
            </button>
          </div>

          <div className="glass-panel" style={{ border: lessonIdToEdit ? '1px solid #fbbf24' : 'none' }}>
            <h3 className="mb-4" style={{ color: lessonIdToEdit ? '#fbbf24' : 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {lessonIdToEdit ? <><Edit size={20} /> Edit Lesson</> : <><PlusCircle size={20} /> Add Video Lesson</>}
            </h3>
            <form onSubmit={handleLessonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>Lesson Title</label>
                  <input type="text" placeholder="e.g. 1. Introduction to Pointers" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>Duration</label>
                  <input type="text" placeholder="e.g. 12:45" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>Video URL (Mock Embed)</label>
                <input type="text" placeholder="https://youtube.com/..." value={lessonVideo} onChange={(e) => setLessonVideo(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>Lesson Description</label>
                <textarea placeholder="What will students learn in this video?" value={lessonDesc} onChange={(e) => setLessonDesc(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} rows="3" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                <input type="checkbox" id="freePreview" checked={isFreePreview} onChange={(e) => setIsFreePreview(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <label htmlFor="freePreview" style={{ color: 'white' }}>Set as Free Preview (Unlocked before payment)</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn" style={{ flex: 1, background: lessonIdToEdit ? '#fbbf24' : 'var(--accent-color)', color: '#0f172a' }}>
                  {isLessonSaved ? 'Saved!' : lessonIdToEdit ? 'Update Lesson' : 'Add Lesson to Syllabus'}
                </button>
                {lessonIdToEdit && (
                  <button type="button" onClick={cancelEditLesson} className="btn btn-secondary">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {customLessons.length > 0 && (
            <div className="glass-panel">
              <h3 className="mb-4" style={{ color: 'white' }}>Course Syllabus Manager ({customLessons.length} Lessons)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {customLessons.map((l, index) => (
                  <div key={l.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold' }}>{index + 1}</div>
                      <div>
                        <strong style={{ color: l.locked ? 'white' : 'var(--success-color)' }}>{l.title}</strong>
                        <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
                          <span>{l.duration}</span>
                          {!l.locked && <span>★ Free Preview</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEditLesson(l)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}><Edit size={16} /></button>
                      <button onClick={() => handleLessonDelete(l.id)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#f87171', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'staff' && userRole === 'superadmin' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel">
            <h3 className="mb-4" style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={24} /> Role-Based Access Control</h3>
            <p className="mb-4" style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              Assign roles to your team members. When they log in with Google, their dashboard will be restricted to the tools they need.
            </p>
            <form onSubmit={handleStaffSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Staff Email (Google Account)</label>
                <input type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} placeholder="ta@university.edu" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Assign Role</label>
                <select value={staffRole} onChange={(e) => setStaffRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="quiz_manager">Quiz & Problem Manager</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <button type="submit" className="btn" style={{ padding: '0.75rem 1.5rem' }}>{isStaffSaved ? 'Added' : 'Add Staff'}</button>
            </form>
          </div>

          <div className="glass-panel">
            <h3 className="mb-4" style={{ color: 'white' }}>Current Staff ({staffList.length})</h3>
            {staffList.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No staff members added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {staffList.map((staff) => (
                  <div key={staff.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <strong style={{ color: 'white' }}>{staff.email}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginTop: '0.25rem' }}>
                        {staff.role === 'superadmin' ? 'Superadmin (Master Access)' : 'Quiz & Problem Manager'}
                      </div>
                    </div>
                    <button onClick={() => handleStaffDelete(staff.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'contests' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel">
              <h3 className="mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={20} /> Create New Contest</h3>
              <form onSubmit={handleContestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Contest Title" value={contestTitle} onChange={(e) => setContestTitle(e.target.value)} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                <textarea placeholder="Description (Optional)..." value={contestDesc} onChange={(e) => setContestDesc(e.target.value)} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} rows="2" />
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>Schedule Contest</label>
                    <button type="button" onClick={() => setContestStart(new Date().toISOString().slice(0, 16))} style={{ fontSize: '0.75rem', background: 'rgba(56,189,248,0.1)', color: 'var(--accent-color)', border: '1px solid rgba(56,189,248,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Start Now</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <Calendar size={14} color="var(--accent-color)" />
                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Start Date & Time</span>
                      </div>
                      <input type="datetime-local" value={contestStart} onChange={(e) => setContestStart(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <Clock size={14} color="#fbbf24" />
                          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Duration</span>
                        </div>
                        <select value={contestDuration} onChange={(e) => { setContestDuration(e.target.value); setContestEnd(''); }} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
                          <option value="1">1 Hour</option>
                          <option value="2">2 Hours</option>
                          <option value="3">3 Hours</option>
                          <option value="4">4 Hours</option>
                          <option value="12">12 Hours</option>
                          <option value="24">24 Hours (1 Day)</option>
                          <option value="48">48 Hours (2 Days)</option>
                          <option value="custom">Custom End Time...</option>
                        </select>
                      </div>
                      
                      {contestDuration === 'custom' && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <Settings size={14} color="#f87171" />
                            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Ends At</span>
                          </div>
                          <input type="datetime-local" value={contestEnd} onChange={(e) => setContestEnd(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: contestType === 'group' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Participation Type</label>
                    <select value={contestType} onChange={(e) => setContestType(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <option value="individual">Individual Participation</option>
                      <option value="group">Group Competition</option>
                    </select>
                  </div>
                  {contestType === 'group' && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Max Team Size</label>
                      <input 
                        type="number" 
                        min="2" 
                        max="20" 
                        value={maxTeamSize} 
                        onChange={(e) => setMaxTeamSize(e.target.value)} 
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'white' }}>Select Problems ({selectedProbIds.length})</label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {firestoreProblems.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '1rem' }}>No problems available. Add problems first!</p>
                    ) : (
                      firestoreProblems.map(p => (
                        <div key={p.firestoreId} onClick={() => toggleProblemSelection(p.firestoreId)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px', background: selectedProbIds.includes(p.firestoreId) ? 'rgba(56,189,248,0.1)' : 'transparent' }}>
                          <input type="checkbox" checked={selectedProbIds.includes(p.firestoreId)} readOnly style={{ cursor: 'pointer' }} />
                          <span style={{ fontSize: '0.85rem', color: selectedProbIds.includes(p.firestoreId) ? '#38bdf8' : 'white' }}>{p.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button type="submit" className="btn" style={{ background: isContestSaved ? 'var(--success-color)' : 'var(--accent-color)', color: '#0f172a', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  {isContestSaved ? '✓ Contest Created!' : 'Create Contest'}
                </button>
              </form>
            </div>

            <div className="glass-panel">
              <h3 className="mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trophy size={20} /> Existing Contests ({firestoreContests.length})</h3>
              {contestLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader size={24} className="animate-spin" /></div>
              ) : firestoreContests.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>No contests created yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {firestoreContests.map(c => (
                    <div key={c.firestoreId} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'white' }}>{c.title}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{new Date(c.startTime).toLocaleString()} - {c.type}</div>
                      </div>
                      <button onClick={() => handleContestDelete(c.firestoreId)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inbox' && userRole === 'superadmin' && (
        <div className="animate-fade-in glass-panel" style={{ display: 'flex', height: '600px', padding: 0, overflow: 'hidden' }}>
          {/* Left Sidebar - Chat List */}
          <div style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageCircle size={20} /> Student Q&A</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {inboxChats.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No student questions yet.</div>
              ) : (
                inboxChats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id);
                      if (chat.hasUnreadStudentMessage) {
                        updateDoc(doc(db, 'chats', chat.id), { hasUnreadStudentMessage: false }).catch(console.error);
                      }
                    }}
                    style={{ 
                      padding: '1rem', 
                      cursor: 'pointer', 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: selectedChatId === chat.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ color: selectedChatId === chat.id ? 'var(--accent-color)' : 'white' }}>{chat.studentName || 'Anonymous Student'}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    {chat.hasUnreadStudentMessage && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Chat Window */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
            {!selectedChatId ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Select a student conversation to reply
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                  <strong style={{ color: 'white' }}>Replying to: {inboxChats.find(c => c.id === selectedChatId)?.studentName}</strong>
                </div>

                {/* Messages Array */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {inboxChats.find(c => c.id === selectedChatId)?.messages?.map((msg, idx) => {
                    const isInstructor = msg.sender === 'instructor';
                    return (
                      <div key={idx} style={{ alignSelf: isInstructor ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem', textAlign: isInstructor ? 'right' : 'left' }}>
                          {isInstructor ? 'You' : 'Student'}
                        </div>
                        <div style={{ 
                          background: isInstructor ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.1)', 
                          color: 'white', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px', 
                          borderTopRightRadius: isInstructor ? '2px' : '12px',
                          borderTopLeftRadius: isInstructor ? '12px' : '2px'
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input */}
                <form onSubmit={handleReplyToStudent} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
                  <input 
                    type="text" 
                    placeholder="Type your reply to the student..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                  <button 
                    type="submit" 
                    disabled={!replyText.trim()}
                    style={{ background: 'var(--accent-color)', border: 'none', width: '50px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', cursor: 'pointer', opacity: !replyText.trim() ? 0.5 : 1 }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
