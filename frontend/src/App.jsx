import React, { useState, useEffect, createContext } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AiScanner from './components/AiScanner';
import MealLogger from './components/MealLogger';
import AiChat from './components/AiChat';
import Goals from './components/Goals';

export const CalorieContext = createContext();

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  
  // Default target guidelines from the screenshots (2,200 kcal goal, 120g P, 180g C, 45g F)
  const [goals, setGoals] = useState({
    targetCalories: 2200,
    proteinTarget: 120,
    carbsTarget: 180,
    fatsTarget: 45,
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate',
    goalType: 'maintain'
  });

  const [loading, setLoading] = useState(true);

  // Synchronize on mount and date changes
  const fetchMeals = async (date) => {
    try {
      const response = await fetch(`/api/meals?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      }
    } catch (err) {
      console.error('Meals sync error, loading default values:', err);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (err) {
      console.error('Goals sync error:', err);
    }
  };

  useEffect(() => {
    const bootstrapData = async () => {
      setLoading(true);
      await fetchGoals();
      await fetchMeals(activeDate);
      setLoading(false);
    };
    bootstrapData();
  }, [activeDate]);

  // Log a new food item
  const handleAddMeal = async (mealData) => {
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mealData, date: activeDate })
      });
      if (response.ok) {
        const data = await response.json();
        setMeals(prev => [data, ...prev]);
        return data;
      }
    } catch (err) {
      console.error('Add meal API failed, writing to local memory:', err);
    }

    const localItem = {
      id: Math.random().toString(),
      ...mealData,
      date: activeDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setMeals(prev => [localItem, ...prev]);
    return localItem;
  };

  // Remove a food item
  const handleDeleteMeal = async (mealId) => {
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMeals(prev => prev.filter(m => m._id !== mealId && m.id !== mealId));
        return true;
      }
    } catch (err) {
      console.error('Delete API failed:', err);
    }
    setMeals(prev => prev.filter(m => m._id !== mealId && m.id !== mealId));
  };

  // Save goal targets
  const handleSaveGoals = async (updatedGoals) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoals)
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
        return data;
      }
    } catch (err) {
      console.error('Save goals API failed:', err);
    }
    setGoals(updatedGoals);
  };

  // Aggregated Stats
  const totalConsumed = meals.reduce((sum, m) => sum + Number(m.calories), 0);
  const totalProtein = meals.reduce((sum, m) => sum + Number(m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + Number(m.carbs || 0), 0);
  const totalFats = meals.reduce((sum, m) => sum + Number(m.fats || 0), 0);

  // Helper date renderer
  const getFormattedDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  };

  const contextValue = {
    activeTab,
    setActiveTab,
    activeDate,
    setActiveDate,
    meals,
    goals,
    loading,
    totalConsumed,
    totalProtein,
    totalCarbs,
    totalFats,
    handleAddMeal,
    handleDeleteMeal,
    handleSaveGoals,
    getFormattedDate
  };

  // Render components depending on tabs
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'planner':
        return <AiChat />;
      case 'analysis':
        return <Goals />;
      case 'ingredients':
        return <AiScanner />;
      case 'schedule':
        return <MealLogger />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CalorieContext.Provider value={contextValue}>
      <div className="app-container">
        <Navbar />

        <main className="content-canvas" id="main-content-canvas">
          {/* Top header navigation widgets */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Nutritional Journal Date
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {getFormattedDate(activeDate)}
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  Live Active
                </span>
              </div>
            </div>

            {/* Date selection arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => {
                  const yest = new Date(activeDate);
                  yest.setDate(yest.getDate() - 1);
                  setActiveDate(yest.toISOString().split('T')[0]);
                }}
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                id="btn-prev-day-arrow"
              >
                ◀ Yesterday
              </button>
              
              <input 
                type="date" 
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
                style={{ padding: '7px 12px', background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)' }}
                id="date-navigator-field"
              />

              <button 
                onClick={() => {
                  const tom = new Date(activeDate);
                  tom.setDate(tom.getDate() + 1);
                  setActiveDate(tom.toISOString().split('T')[0]);
                }}
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                id="btn-next-day-arrow"
              >
                Tomorrow ▶
              </button>
            </div>
          </div>

          {/* Active section */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: '12px' }}>
              <div className="typing-dot" style={{ width: '10px', height: '10px' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Syncing NutriFlow details...</p>
            </div>
          ) : (
            renderTab()
          )}
        </main>
      </div>
    </CalorieContext.Provider>
  );
}
