import React, { useState, useContext, useEffect } from 'react';
import { CalorieContext } from '../App';

export default function Goals() {
  const { goals, handleSaveGoals, meals, totalConsumed } = useContext(CalorieContext);

  // Profile forms state
  const [weight, setWeight] = useState(goals.weight || 70);
  const [height, setHeight] = useState(goals.height || 175);
  const [age, setAge] = useState(goals.age || 25);
  const [gender, setGender] = useState(goals.gender || 'male');
  const [activityLevel, setActivityLevel] = useState(goals.activityLevel || 'moderate');
  const [goalType, setGoalType] = useState(goals.goalType || 'maintain');

  const [targetCalories, setTargetCalories] = useState(goals.targetCalories || 2200);
  const [proteinTarget, setProteinTarget] = useState(goals.proteinTarget || 120);
  const [carbsTarget, setCarbsTarget] = useState(goals.carbsTarget || 180);
  const [fatsTarget, setFatsTarget] = useState(goals.fatsTarget || 45);

  const [saving, setSaving] = useState(false);
  const [showConfig, setShowConfig] = useState(false); // Collapsible drawer

  // Recalculate TDEE & macros dynamically in the browser
  useEffect(() => {
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5;
    } else {
      bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9
    };
    
    const mult = activityMultipliers[activityLevel] || 1.55;
    const tdee = bmr * mult;

    let calTarget = tdee;
    if (goalType === 'lose') calTarget = tdee - 450;
    else if (goalType === 'gain') calTarget = tdee + 350;

    const finalCalorie = Math.round(calTarget);
    const pGrams = Math.round(Number(weight) * 2.0);
    const fGrams = Math.round((finalCalorie * 0.25) / 9);
    const remainingCals = finalCalorie - (pGrams * 4) - (fGrams * 9);
    const cGrams = Math.max(20, Math.round(remainingCals / 4));

    setTargetCalories(finalCalorie);
    setProteinTarget(pGrams);
    setCarbsTarget(cGrams);
    setFatsTarget(fGrams);
  }, [weight, height, age, gender, activityLevel, goalType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await handleSaveGoals({
      targetCalories,
      proteinTarget,
      carbsTarget,
      fatsTarget,
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender,
      activityLevel,
      goalType
    });
    setSaving(false);
    setShowConfig(false);
    alert('✅ Health goals and targets adjusted successfully!');
  };

  // Mock data for weekly charts
  const weeklyConsumption = [
    { day: 'Mon', intake: 1980, target: 2200 },
    { day: 'Tue', intake: 2150, target: 2200 },
    { day: 'Wed', intake: 2240, target: 2200 },
    { day: 'Thu', intake: 1850, target: 2200 },
    { day: 'Fri', intake: 2300, target: 2200 },
    { day: 'Sat', intake: 2050, target: 2200 },
    { day: 'Sun', intake: totalConsumed || 1640, target: 2200 }
  ];

  const weeklyWater = [
    { day: 'Mon', cups: 2.0 },
    { day: 'Tue', cups: 2.5 },
    { day: 'Wed', cups: 3.0 },
    { day: 'Thu', cups: 1.8 },
    { day: 'Fri', cups: 2.8 },
    { day: 'Sat', cups: 3.2 },
    { day: 'Sun', cups: 2.2 }
  ];

  const achievements = [
    { label: '7-Day Streak', desc: 'Met energy target daily', icon: '🔥' },
    { label: 'Hydration Hero', desc: 'Drank 2.5L+ 5 days in a row', icon: '💧' },
    { label: 'Protein Power', desc: 'Hit muscle recovery goals', icon: '💪' },
    { label: 'Perfect Month', desc: 'Outstanding diary tracking', icon: '🏆' }
  ];

  return (
    <div>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Health Analysis</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Personalized insights based on your last 7 days of activity.
          </p>
        </div>

        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          id="btn-toggle-config-panel"
        >
          ⚙️ Adjust Targets
        </button>
      </div>

      {/* COLLAPSIBLE CONFIGURATION PANEL DRAWER */}
      {showConfig && (
        <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px', background: '#ffffff' }} id="goals-drawer-config">
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '14px' }}>
            Adjust physical parameters and recalculate BMR / TDEE
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Biological Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fitness Goal</label>
                <select value={goalType} onChange={(e) => setGoalType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="lose">Lose Weight (Deficit)</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Muscle (Surplus)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Age (years)</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={{ width: '100%', padding: '8px' }} min="1" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '100%', padding: '8px' }} min="20" required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{ width: '100%', padding: '8px' }} min="50" required />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Activity Multiplier</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="sedentary">Sedentary (1.2x)</option>
                  <option value="light">Lightly Active (1.375x)</option>
                  <option value="moderate">Moderately Active (1.55x)</option>
                  <option value="active">Very Active (1.725x)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" disabled={saving} className="btn-primary hover-glow" style={{ flex: 1.5, padding: '10px', fontSize: '0.85rem' }}>
                {saving ? 'Saving...' : 'Save Parameters & Update Calorie Target'}
              </button>
              <button type="button" onClick={() => setShowConfig(false)} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
                Cancel
              </button>
            </div>

          </form>
        </section>
      )}

      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        
        {/* STATISTICAL INSIGHTS LEFT BOX (Spans 4 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 4',
          padding: '24px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '14px' }}>
              Statistical Insights
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Avg Intake */}
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Average Daily Intake
                </span>
                <h4 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '2px' }}>
                  2,140 <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>kcal</span>
                </h4>
              </div>

              {/* Avg Hydration */}
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Average Daily Water
                </span>
                <h4 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--secondary-blue)', marginTop: '2px' }}>
                  3.2 <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Liters</span>
                </h4>
              </div>

            </div>
          </div>

          {/* Consistency score circle ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ position: 'relative', width: '56px', height: '56px', shrink: 0 }}>
              <svg height="56" width="56">
                <circle stroke="rgba(0,0,0,0.03)" fill="transparent" strokeWidth="4" r="22" cx="28" cy="28" />
                <circle stroke="var(--primary-green)" className="radial-progress-ring" fill="transparent" strokeWidth="4.5" strokeDasharray="138 138" strokeDashoffset="11" r="22" cx="28" cy="28" strokeLinecap="round" />
              </svg>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.8rem', fontWeight: 800 }}>
                92
              </span>
            </div>
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Consistency Score</h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Excellent tracking streak</p>
            </div>
          </div>
        </section>

        {/* WEEKLY METRICS CHARTS (Spans 8 Columns) */}
        <section className="glass-panel" style={{
          gridColumn: 'span 8',
          padding: '24px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Daily Fuel Consumption Bar Chart */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 700 }}>
              Daily Fuel Consumption (Last 7 Days)
            </h4>

            {/* Custom high-fidelity CSS Bar Chart */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', padding: '0 10px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '10px' }}>
              {weeklyConsumption.map((c, idx) => {
                const heightPct = Math.min(100, Math.round((c.intake / c.target) * 100));
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                      {/* Intake Bar */}
                      <div style={{
                        width: '16px',
                        height: `${heightPct * 1.1}px`,
                        background: 'var(--primary-green)',
                        borderRadius: '4px 4px 0 0',
                        boxShadow: '0 2px 6px rgba(18, 194, 108, 0.15)',
                        transition: 'height 0.3s ease'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '6px' }}>{c.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom sub-charts split: Donut macros & line water */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Macro Distribution split */}
            <div>
              <h5 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
                Weekly Macro Balance
              </h5>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                  <svg height="64" width="64">
                    <circle stroke="rgba(0,0,0,0.03)" fill="transparent" strokeWidth="6" r="24" cx="32" cy="32" />
                    {/* Ring sections showing 45% Protein, 35% Carbs, 20% Fats */}
                    <circle stroke="var(--primary-green)" className="radial-progress-ring" fill="transparent" strokeWidth="6.5" strokeDasharray="150 150" strokeDashoffset="67" r="24" cx="32" cy="32" strokeLinecap="round" />
                  </svg>
                  <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.78rem', fontWeight: 800 }}>
                    45%
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--primary-green)' }}>🟢 Protein (45%)</span>
                  <span style={{ color: 'var(--secondary-blue)' }}>🔵 Carbs (35%)</span>
                  <span style={{ color: 'var(--accent-amber)' }}>🟡 Fats (20%)</span>
                </div>
              </div>
            </div>

            {/* Water Trends */}
            <div>
              <h5 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
                Water Intake Trends
              </h5>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '40px', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                {weeklyWater.map((w, idx) => {
                  const h = Math.round((w.cups / 4) * 30);
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        flex: 1, 
                        height: `${h}px`, 
                        background: 'linear-gradient(0deg, rgba(0, 136, 255, 0.4) 0%, rgba(0, 136, 255, 0.1) 100%)', 
                        borderRadius: '2px 2px 0 0' 
                      }}
                    />
                  );
                })}
              </div>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px', textAlign: 'center', fontWeight: 600 }}>
                Mon-Sun tracking overview
              </span>
            </div>

          </div>

        </section>

      </div>

      {/* ROW 3: RECENT ACHIEVEMENTS CARDS */}
      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '14px' }}>
        Recent Achievements
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {achievements.map((ach, idx) => (
          <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff' }}>
            <span style={{ fontSize: '1.6rem' }}>{ach.icon}</span>
            <div>
              <h5 style={{ fontSize: '0.88rem', fontWeight: 800 }}>{ach.label}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{ach.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM CITRUS BANNER: UNLOCK YOUR FULL POTENTIAL */}
      <section className="glass-panel" style={{
        padding: '24px 30px',
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FEE2E2 100%)',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '2.5rem' }}>🍊</span>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>
              Unlock Your Full Potential
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 700, marginTop: '2px', lineHeight: 1.4 }}>
              Our AI coach has detected that your energy levels peak on Wednesdays. Let's schedule your toughest workouts then.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('🍊 AI Coach is personalizing your bio-weekly schedule plan now!')}
          className="btn-primary" 
          style={{
            background: 'var(--primary-green)',
            color: '#ffffff',
            padding: '12px 20px',
            fontSize: '0.85rem',
            boxShadow: '0 4px 10px rgba(18, 194, 108, 0.25)'
          }}
          id="btn-citrus-personalize"
        >
          Personalize My Plan
        </button>
      </section>
      
      {/* Hide scrollbar */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="repeat(4, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
