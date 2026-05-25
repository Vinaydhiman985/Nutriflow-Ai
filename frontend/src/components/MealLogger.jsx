import React, { useState, useContext } from 'react';
import { CalorieContext } from '../App';

export default function MealLogger() {
  const { meals, handleAddMeal, handleDeleteMeal } = useContext(CalorieContext);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetSlot, setTargetSlot] = useState('breakfast');
  
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const mealSlots = [
    { id: 'breakfast', label: 'Breakfast Slot', icon: '🍳' },
    { id: 'lunch', label: 'Lunch Slot', icon: '🥗' },
    { id: 'dinner', label: 'Dinner Slot', icon: '🐟' },
    { id: 'snack', label: 'Snacks & Sides', icon: '🍎' }
  ];

  const handleOpenForm = (slotId) => {
    setTargetSlot(slotId);
    setShowAddForm(true);
    setTitle('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !calories) return;

    await handleAddMeal({
      title,
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fats: Number(fats || 0),
      mealType: targetSlot,
      aiAnalysis: false
    });

    setShowAddForm(false);
  };

  return (
    <div>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Nutritional Journal Log</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Manage your daily food log entries, portions, and physical calorie targets.
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenForm('breakfast')} 
          className="btn-primary hover-glow"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          id="btn-journal-manual-add-light"
        >
          <span>➕</span> Log Custom Food
        </button>
      </div>

      {/* DIARY SLOTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {mealSlots.map(slot => {
          const slotMeals = meals.filter(m => m.mealType === slot.id);
          const slotCalories = slotMeals.reduce((sum, m) => sum + Number(m.calories), 0);

          return (
            <section 
              key={slot.id} 
              className="glass-panel" 
              style={{ padding: '24px', background: '#ffffff' }}
              id={`meal-slot-panel-light-${slot.id}`}
            >
              {/* Slot Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                paddingBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{slot.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800 }}>{slot.label}</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      ITEMS LOGGED: {slotMeals.length}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {slotCalories > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Total</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--accent-rose)', fontWeight: 800 }}>
                        {slotCalories} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>kcal</span>
                      </strong>
                    </div>
                  )}
                  <button 
                    onClick={() => handleOpenForm(slot.id)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>➕</span> Add
                  </button>
                </div>
              </div>

              {/* Slot Meal Log list */}
              {slotMeals.length === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  background: 'var(--bg-canvas)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(0,0,0,0.06)',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  No food logs registered in {slot.label.toLowerCase()} today.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {slotMeals.map(meal => (
                    <div
                      key={meal._id || meal.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 18px',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.04)',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '0.94rem', fontWeight: 800 }}>{meal.title}</h4>
                            {meal.aiAnalysis && (
                              <span className="badge badge-blue" style={{ fontSize: '0.58rem', padding: '1px 6px' }}>
                                AI Scan
                              </span>
                            )}
                          </div>
                          
                          {/* Mini macros indicators */}
                          <div style={{ display: 'flex', gap: '12px', marginTop: '3px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            <span style={{ color: 'var(--secondary-blue)' }}>{meal.time || '12:00'}</span>
                            <span>•</span>
                            <span>Protein: <strong style={{ color: 'var(--text-main)' }}>{meal.protein || 0}g</strong></span>
                            <span>Carbs: <strong style={{ color: 'var(--text-main)' }}>{meal.carbs || 0}g</strong></span>
                            <span>Fats: <strong style={{ color: 'var(--text-main)' }}>{meal.fats || 0}g</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Calorie tag and Delete Action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                            {meal.calories}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '3px', fontWeight: 600 }}>
                            kcal
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${meal.title}"?`)) {
                              handleDeleteMeal(meal._id || meal.id);
                            }
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          className="hover-glow"
                          title="Delete entry"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* QUICK ADD DRAWER MODAL OVERLAY */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '460px',
            padding: '24px 30px',
            borderRadius: '24px',
            background: '#ffffff',
            boxShadow: '0 20px 40px rgba(15,23,42,0.08)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800 }}>
                  Log Custom Food Entry
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 700 }}>
                  Target slot: **{targetSlot}**
                </span>
              </div>
              <button 
                onClick={() => setShowAddForm(false)} 
                style={{ background: 'rgba(0,0,0,0.04)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', fontSize: '0.95rem', fontWeight: 600 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Meal Name / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mixed Nuts, Whey Protein Shake"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%' }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    placeholder="250"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    style={{ width: '100%' }}
                    min="0"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    style={{ width: '100%' }}
                    min="0"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    placeholder="8"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    style={{ width: '100%' }}
                    min="0"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary hover-glow" 
                  style={{ flex: 1, padding: '10px' }}
                  id="btn-submit-manual-meal-light"
                >
                  Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
