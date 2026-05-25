import React, { useState, useEffect, useRef, useContext } from 'react';
import { CalorieContext } from '../App';

export default function AiChat() {
  const { goals, meals, totalConsumed } = useContext(CalorieContext);

  // Today's schedule slots
  const [schedule, setSchedule] = useState([
    { id: 1, type: 'breakfast', time: '08:00 AM', name: 'Avocado Toast with Poached Eggs', cals: 410, tag: 'High Protein', tagType: 'green', checked: true },
    { id: 2, type: 'lunch', time: '01:00 PM', name: 'Quinoa Power Bowl with Chicken', cals: 650, tag: 'Complex Carbs', tagType: 'blue', checked: false },
    { id: 3, type: 'snack', time: '04:30 PM', name: 'Greek Yogurt with Mixed Berries', cals: 180, tag: 'Low Fat', tagType: 'amber', checked: false },
    { id: 4, type: 'dinner', time: '07:30 PM', name: 'Baked Salmon with Asparagus', cals: 550, tag: 'Omega-3 Rich', tagType: 'green', checked: false }
  ]);

  // AI chat specific state
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      content: `Hello! I've adjusted your lunch today to include more magnesium based on your sleep data. 

How are you feeling after breakfast? Did it keep you satisfied, or are we ready to optimize your Quinoa Bowl?`,
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  // Prompt suggestions from screenshots
  const prompts = [
    'Plan a 2000 cal day',
    'Add post-workout snack',
    'Low carb alternatives'
  ];

  // Send message
  const handleSend = async (textText) => {
    const text = textText || inputVal;
    if (!text.trim() || thinking) return;

    const userMsg = {
      id: Math.random().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setThinking(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, content: m.content })),
          userGoals: goals,
          mealsLog: meals
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'ai',
          content: data.reply,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error('Chat API error:', err);
    } finally {
      setThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Convert markdown rules
  const renderMarkdown = (txt) => {
    if (!txt) return '';
    return txt
      .split('\n')
      .map((line, idx) => {
        let clean = line;
        clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        clean = clean.replace(/\*(.*?)\*/g, '<em>$1</em>');
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return `<li key=${idx} style="margin-left: 14px; margin-bottom: 4px; font-weight: 500;">${clean.substring(2)}</li>`;
        }
        return `<p key=${idx} style="margin-bottom: 6px; font-weight: 500;">${clean}</p>`;
      })
      .join('');
  };

  return (
    <div>
      {/* Title banner */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>AI Planner & Coach</h1>
        <p className="page-subtitle">Optimizing your performance through bio-intelligent nutrition.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* TODAY'S SCHEDULE (Left 6 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 6',
          padding: '24px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                Today's Schedule
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 800, cursor: 'pointer' }} id="btn-edit-planner-schedule">
                Edit Plan
              </span>
            </div>

            {/* Timetable logs list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {schedule.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.01)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    borderRadius: '14px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {
                      setSchedule(prev => prev.map(s => {
                        if (s.id === item.id) return { ...s, checked: !s.checked };
                        return s;
                      }));
                    }}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: 'var(--primary-green)',
                      cursor: 'pointer'
                    }}
                  />
                  
                  <div style={{ width: '60px', shrink: 0 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>
                      {item.type.toUpperCase()}
                    </span>
                    <strong style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {item.time}
                    </strong>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h5 style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      textDecoration: item.checked ? 'line-through' : 'none',
                      opacity: item.checked ? 0.6 : 1
                    }}>
                      {item.name}
                    </h5>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
                        {item.cals} kcal
                      </span>
                      <span className={`badge badge-${item.tagType}`} style={{ fontSize: '0.58rem', padding: '1px 6px' }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--primary-green-light)',
            borderLeft: '3px solid var(--primary-green)',
            padding: '12px',
            borderRadius: '0 10px 10px 0',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
            marginTop: '20px',
            fontWeight: 500
          }}>
            🎯 <strong>Dietitian Advisory:</strong> Completing your schedule targets today puts you at a net **350 kcal deficit**—perfect for your weight loss trajectory!
          </div>
        </section>

        {/* NUTRIBOT AI COACH CHAT WINDOW (Right 6 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 6',
          display: 'flex',
          flexDirection: 'column',
          height: '480px',
          overflow: 'hidden',
          background: '#ffffff'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🍏</span>
              <div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 800 }}>NutriBot AI Coach</h4>
                <span style={{
                  fontSize: '0.68rem',
                  color: 'var(--primary-green)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary-green)', display: 'inline-block' }}></span>
                  Online • Personalized
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Target: {goals.targetCalories || 2200} kcal
            </span>
          </div>

          {/* Messages Scroller Canvas */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }} id="nutribot-scroller">
            {messages.map(msg => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isAi ? 'flex-start' : 'flex-end',
                    width: '100%'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    maxWidth: '85%',
                    flexDirection: isAi ? 'row' : 'row-reverse'
                  }}>
                    {/* Tiny avatar indicator */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isAi ? 'var(--primary-green-light)' : 'rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {isAi ? '🤖' : '👤'}
                    </div>

                    {/* Chat Text Card */}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: isAi ? '0 14px 14px 14px' : '14px 0 14px 14px',
                      background: isAi ? 'var(--primary-green-light)' : '#f3f4f6',
                      border: '1px solid',
                      borderColor: isAi ? 'rgba(18, 194, 108, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                      fontSize: '0.85rem'
                    }}>
                      <div 
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                        style={{ overflowWrap: 'anywhere' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {thinking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                  <div className="glass-panel" style={{ padding: '10px 14px', borderRadius: '0 14px 14px 14px', background: '#f9fafb' }}>
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts strip */}
          <div style={{
            padding: '8px 16px 2px 16px',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            borderTop: '1px solid rgba(0,0,0,0.03)'
          }} id="chat-prompts-scroller">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={thinking}
                style={{
                  padding: '6px 12px',
                  borderRadius: '99px',
                  fontSize: '0.72rem',
                  background: 'var(--secondary-blue-light)',
                  color: 'var(--secondary-blue)',
                  border: '1px solid rgba(0, 136, 255, 0.15)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                id={`chat-prompt-pill-${idx}`}
              >
                💡 {p}
              </button>
            ))}
          </div>

          {/* User Chat Input Bar */}
          <div style={{ padding: '12px 16px 16px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Ask NutriBot anything..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={thinking}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
              id="chat-field-input"
            />
            <button
              onClick={() => handleSend()}
              disabled={thinking || !inputVal.trim()}
              className="btn-primary hover-glow"
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: thinking || !inputVal.trim() ? '#e5e7eb' : 'var(--primary-green)',
                color: thinking || !inputVal.trim() ? '#9ca3af' : '#ffffff',
                cursor: thinking || !inputVal.trim() ? 'not-allowed' : 'pointer'
              }}
              id="btn-send-message"
            >
              Send
            </button>
          </div>

        </section>

      </div>
      
      {/* Hide scrollers */}
      <style>{`
        #nutribot-scroller::-webkit-scrollbar { width: 4px; }
        #chat-prompts-scroller::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
