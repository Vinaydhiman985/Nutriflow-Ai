import React, { useContext, useState, useEffect } from 'react';
import { CalorieContext } from '../App';

export default function Dashboard() {
  const { 
    meals, 
    goals, 
    totalConsumed, 
    totalProtein, 
    totalCarbs, 
    totalFats,
    handleAddMeal,
    setActiveTab
  } = useContext(CalorieContext);

  const [waterLiters, setWaterLiters] = useState(() => {
    const saved = localStorage.getItem('nutriflow_water_liters');
    return saved ? parseFloat(saved) : 1.8;
  });

  const [reminders, setReminders] = useState([
    { id: 1, text: 'Breakfast: Avocado Toast', time: 'Completed at 08:30 AM', checked: true },
    { id: 2, text: 'Mid-day Hydration Window', time: 'Active now', checked: false },
    { id: 3, text: 'High-Protein Lunch', time: 'Scheduled for 01:00 PM', checked: false }
  ]);

  // Sync water liters
  const handleLogWater = () => {
    if (waterLiters < 2.5) {
      const updated = Math.min(2.5, parseFloat((waterLiters + 0.25).toFixed(2)));
      setWaterLiters(updated);
      localStorage.setItem('nutriflow_water_liters', updated.toString());
      
      // Auto check hydration reminder if they drink water
      setReminders(prev => prev.map(rem => {
        if (rem.id === 2) return { ...rem, checked: true, time: 'Completed just now' };
        return rem;
      }));
    }
  };

  const handleResetWater = () => {
    setWaterLiters(0);
    localStorage.setItem('nutriflow_water_liters', '0');
  };

  // Preset Unsplash images matching screenshots exactly!
  const foodImages = {
    breakfast: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&auto=format&fit=crop&q=60', // Protein Berry Oats
    lunch: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60',     // Salmon Quinoa Grain bowl
    dinner: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60',    // Paneer & Rice with Yogurt
    snack: 'https://images.unsplash.com/photo-1517686469429-8faf88b9f7af?w=500&auto=format&fit=crop&q=60'      // Oatmeal Berries
  };

  // Quick Accept AI Suggestion
  const handleAcceptSuggestion = async () => {
    await handleAddMeal({
      title: 'Baked Salmon & Asparagus',
      calories: 510,
      protein: 38,
      carbs: 12,
      fats: 22,
      mealType: 'dinner',
      aiAnalysis: true
    });
    alert('✅ "Baked Salmon & Asparagus" logged for dinner based on Coach Suggestion!');
  };

  // Calculations
  const targetCalories = goals.targetCalories || 2200;
  const caloriePercent = Math.min(100, Math.round((totalConsumed / targetCalories) * 100));

  const proteinTarget = goals.proteinTarget || 120;
  const carbsTarget = goals.carbsTarget || 180;
  const fatsTarget = goals.fatsTarget || 45;

  const proteinPct = Math.min(100, Math.round((totalProtein / proteinTarget) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbs / carbsTarget) * 100));
  const fatsPct = Math.min(100, Math.round((totalFats / fatsTarget) * 100));

  // Circular gauge calculations
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  return (
    <div>
      {/* Title greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>NutriFlow AI</h1>
        <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💚</span>
          <span>Your Digital Health Coach • Active and tracking your bio-metrics.</span>
        </p>
      </div>

      {/* DASHBOARD ROW: TODAY'S ENERGY & HYDRATION */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        
        {/* TODAY'S ENERGY CARD (Spans 8 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 8',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '6px' }}>
              Today's Energy
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              You're {caloriePercent}% towards your daily goal.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', margin: '14px 0', flexWrap: 'wrap' }}>
            {/* Circular SVG core ring */}
            <div style={{ position: 'relative', width: '160px', height: '160px', shrink: 0 }}>
              <svg height="160" width="160">
                <circle
                  stroke="rgba(0, 0, 0, 0.03)"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx="80"
                  cy="80"
                />
                <circle
                  className="radial-progress-ring"
                  stroke="var(--primary-green)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  r={normalizedRadius}
                  cx="80"
                  cy="80"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 800, display: 'block', lineHeight: 1 }}>
                  {totalConsumed.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  of {targetCalories} kcal
                </span>
              </div>
            </div>

            {/* Macros stats values column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-green">On Track</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>Intake Breakdown</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Protein */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px', fontWeight: 600 }}>
                    <span>Protein</span>
                    <span>{totalProtein}g / {proteinTarget}g</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${proteinPct}%`, height: '100%', background: 'var(--primary-green)', transition: 'width 0.4s ease' }}></div>
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px', fontWeight: 600 }}>
                    <span>Carbs</span>
                    <span>{totalCarbs}g / {carbsTarget}g</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${carbsPct}%`, height: '100%', background: 'var(--secondary-blue)', transition: 'width 0.4s ease' }}></div>
                  </div>
                </div>

                {/* Fats */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px', fontWeight: 600 }}>
                    <span>Fats</span>
                    <span>{totalFats}g / {fatsTarget}g</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${fatsPct}%`, height: '100%', background: 'var(--accent-amber)', transition: 'width 0.4s ease' }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HYDRATION WATER CARD (Spans 4 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 4',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '4px' }}>
              Hydration
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '14px' }}>
              Goal: 2.5 Liters daily target
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Wave hydrometer */}
            <div className="wave-container" style={{ width: '70px', height: '100px', borderRadius: '12px', border: '1.5px solid rgba(0, 136, 255, 0.15)' }}>
              <div 
                className="wave" 
                style={{ 
                  height: '100%', 
                  top: `${100 - (waterLiters / 2.5) * 100}%`,
                  transition: 'top 0.5s ease-in-out'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: waterLiters > 1.2 ? '#ffffff' : '#000000',
                zIndex: 10
              }}>
                {Math.round((waterLiters / 2.5) * 100)}%
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {waterLiters} Liters
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Goal: 2.5 Liters
              </span>

              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={handleLogWater}
                  disabled={waterLiters >= 2.5}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    background: waterLiters >= 2.5 ? '#f3f4f6' : 'var(--secondary-blue)',
                    color: waterLiters >= 2.5 ? '#9ca3af' : '#ffffff',
                    cursor: waterLiters >= 2.5 ? 'not-allowed' : 'pointer',
                    flex: 1
                  }}
                  className="hover-glow"
                  id="btn-log-water-dashboard"
                >
                  💧 Log 250ml
                </button>
                <button 
                  onClick={handleResetWater}
                  className="btn-secondary" 
                  style={{ padding: '8px', borderRadius: '8px', fontSize: '0.8rem' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* MID ROW: DIARY FOOD CARDS WITH PRESETS & IMAGES */}
      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '14px' }}>
        Daily Food Log
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        
        {/* Breakfast Card */}
        <div className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', background: '#ffffff' }}>
          <div style={{ height: '130px', position: 'relative' }}>
            <img src={foodImages.breakfast} alt="Breakfast" style={{ width: '100%', height: '100%', objectCover: 'cover', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.85)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
              BREAKFAST
            </span>
          </div>
          <div style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800 }}>High-Protein Berry Oats</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
              310 kcal logged
            </span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>CLEAN EATING</span>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>HIGH PROTEIN</span>
            </div>
          </div>
        </div>

        {/* Lunch Card */}
        <div className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', background: '#ffffff' }}>
          <div style={{ height: '130px', position: 'relative' }}>
            <img src={foodImages.lunch} alt="Lunch" style={{ width: '100%', height: '100%', objectCover: 'cover', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.85)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
              LUNCH
            </span>
          </div>
          <div style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800 }}>Quinoa Protein Bowl</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
              420 kcal logged
            </span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>HIGH PROTEIN</span>
              <span className="badge badge-amber" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>LOW CARB</span>
            </div>
          </div>
        </div>

        {/* Dinner Card */}
        <div className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', background: '#ffffff' }}>
          <div style={{ height: '130px', position: 'relative' }}>
            <img src={foodImages.dinner} alt="Dinner" style={{ width: '100%', height: '100%', objectCover: 'cover', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.85)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
              DINNER
            </span>
          </div>
          <div style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800 }}>Paneer & Basmati Rice with Yogurt</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
              550 kcal logged
            </span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>CLEAN EATING</span>
              <span className="badge badge-rose" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>HIGH PROTEIN</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: DAILY REMINDERS & AI COACH INSIGHT */}
      <div className="dashboard-grid">
        
        {/* DAILY REMINDERS (Spans 5 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 5',
          padding: '24px',
          background: '#ffffff'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '14px' }}>
            Daily Reminders
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reminders.map(rem => (
              <div 
                key={rem.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(0,0,0,0.01)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  padding: '12px 16px',
                  borderRadius: '12px'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={rem.checked}
                  onChange={() => {
                    setReminders(prev => prev.map(r => {
                      if (r.id === rem.id) return { ...r, checked: !r.checked, time: !r.checked ? 'Completed just now' : 'Active window' };
                      return r;
                    }));
                  }}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--primary-green)',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: rem.checked ? 'line-through' : 'none',
                    opacity: rem.checked ? 0.6 : 1
                  }}>
                    {rem.text}
                  </h5>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {rem.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI COACH INSIGHT (Spans 7 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 7',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-green-light)',
                color: 'var(--primary-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800
              }}>
                💡
              </div>
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                Coach Insight
              </h3>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
              Great work on hitting your protein target early today! You're slightly ahead on your energy budget. For dinner, the AI suggests **Baked Salmon** to keep your fats within range while providing essential Omega-3s.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={handleAcceptSuggestion}
              className="btn-primary hover-glow"
              style={{
                flex: 1.2,
                padding: '10px 14px',
                fontSize: '0.82rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              id="btn-coach-accept"
            >
              Accept Suggestion
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '0.82rem',
                borderRadius: '10px'
              }}
              id="btn-coach-alternatives"
            >
              Show Alternatives
            </button>
          </div>
        </section>

      </div>
      
      {/* Dynamic styling for grid cards layout */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
