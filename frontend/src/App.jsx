import React, { useState, useEffect, useRef } from 'react';
import { Bot, UserCircle } from 'lucide-react'; 
import './App.css';

function App() {
  const [participantId] = useState(`PID-${Math.random().toString(36).substr(2, 9)}`);
  const [condition] = useState(Math.random() < 0.5 ? 'A' : 'B');
  const [status, setStatus] = useState('active'); // active, rating, loading, finished
  const [tempDecision, setTempDecision] = useState(null);
  const startTime = useRef(null);

  useEffect(() => {
    startTime.current = performance.now(); // Start precision timer
  }, []);

  // Step 1: Capture the Accept/Override decision
  const handleInitialDecision = (decision) => {
    setTempDecision(decision);
    setStatus('rating'); // Move to the confidence rating screen
  };

  // Step 2: Final submit with the rating
  const submitFinalLog = async (rating) => {
    const latency = performance.now() - startTime.current;
    const logData = {
      participant_id: participantId,
      condition: condition === 'A' ? 'Control (Robotic)' : 'Experimental (Humanlike)',
      decision: tempDecision,
      latency_ms: parseFloat(latency.toFixed(2)),
      confidence_rating: rating,
      timestamp: new Date().toISOString()
    };

    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8000/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      if (response.ok) setStatus('finished');
    } catch (err) {
      alert("Error saving data. Is the backend running?");
      setStatus('rating');
    }
  };

  // --- SCREEN: FINISHED ---
  if (status === 'finished') {
    return (
      <div className="container">
        <h1>Task Complete</h1>
        <p>Data logged for Participant: <strong>{participantId}</strong></p>
        <button className="btn accept" onClick={() => window.location.reload()}>Restart for Next Trial</button>
      </div>
    );
  }

  // --- SCREEN: RATING ---
  if (status === 'rating') {
    return (
      <div className="container">
        <div style={{ padding: '40px', background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h2 style={{ marginBottom: '10px' }}>Confidence Assessment</h2>
          <p className="instruction-text">
            On a scale of 1 (Not at all) to 5 (Extremely), how confident are you in your decision to <strong>{tempDecision}</strong> the recommendation?
          </p>
          
          <div className="rating-group">
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num} 
                className="btn-rating" 
                onClick={() => submitFinalLog(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
            Click a number to submit and finish the trial.
          </p>
        </div>
      </div>
    );
  }

  // --- SCREEN: MAIN EXPERIMENT ---
  return (
    <div className="container">
      <header>
        <h1>Decision Support System v1.0</h1>
        <span className="id-badge">ID: {participantId}</span>
      </header>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.5', textAlign: 'left' }}>
          <strong>Scenario:</strong> You are a medical triage coordinator. A patient has arrived with complex symptoms. 
          The AI system has analyzed lab results and is suggesting a high-priority intervention. 
          <strong> Do you follow the recommendation?</strong>
        </p>
      </div>

      <div className={`cue-card ${condition}`}>
        <div className="avatar">
          {condition === 'A' ? <Bot size={48} color="#64748b" /> : <UserCircle size={48} color="#0ea5e9" />}
        </div>
        
        {condition === 'A' ? (
          <div className="content">
            <h3>SYSTEM_LOGIC_UNIT</h3>
            <p>DATA_OUTPUT: Recommended action is <strong>ACCEPT</strong>.</p>
            <p>Probability of success: 94.2%</p>
          </div>
        ) : (
          <div className="content">
            <h3>Hi, I'm Maya!</h3>
            <p>I've analyzed the options and I'm <strong>94% sure</strong> that choosing "Accept" is the best move for us!</p>
            <p>What do you think we should do?</p>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn accept" onClick={() => handleInitialDecision('Accept')}>Accept Advice</button>
        <button className="btn reject" onClick={() => handleInitialDecision('Override')}>Override Advice</button>
      </div>
    </div>
  );
}

export default App;