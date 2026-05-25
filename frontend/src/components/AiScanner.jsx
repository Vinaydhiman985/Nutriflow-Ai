import React, { useState, useContext } from 'react';
import { CalorieContext } from '../App';

export default function AiScanner() {
  const { handleAddMeal } = useContext(CalorieContext);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI scan specific state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState('');
  const [scanSlot, setScanSlot] = useState('lunch');

  // Food library preset collections
  const collections = [
    {
      id: 1,
      title: 'High Protein Essentials',
      desc: 'Foundational building blocks for muscle recovery and metabolic wellness.',
      image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&auto=format&fit=crop&q=60', // Chicken and Eggs
      tags: [{ label: 'P', type: 'green' }, { label: 'F', type: 'amber' }, { label: 'C', type: 'blue' }],
      linkText: 'Explore Collection',
      category: 'proteins'
    },
    {
      id: 2,
      title: 'Seasonal Green Harvest',
      desc: 'Rich in antioxidants and fiber to support your daily digestive wellness.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60', // Broccoli & Veggies
      tags: [{ label: 'V', type: 'green' }, { label: 'M', type: 'blue' }],
      linkText: 'View Seasonal',
      category: 'vegetables'
    }
  ];

  // Raw single ingredient pills
  const singleIngredients = [
    { name: 'Lean Chicken Breast', category: 'proteins', tag: 'PROTEIN', cals: '165 kcal/100g', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&auto=format&fit=crop&q=60' },
    { name: 'Organic Avocados', category: 'superfoods', tag: 'HEALTHY FAT', cals: '160 kcal/100g', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&auto=format&fit=crop&q=60' },
    { name: 'Red Quinoa Seed', category: 'grains', tag: 'COMPLEX CARBS', cals: '120 kcal/100g', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=60' }
  ];

  // Helper trigger scanner
  const handleTriggerAIScan = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setScanning(true);
    setScanResult(null);
    setScanMessage('Analyzing visual coordinates...');

    const statuses = [
      'Scanning calorie densities...',
      'Deconstructing macro values...',
      'Matching ingredient catalog...',
      'Generating coach Wellness insights...'
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < statuses.length) {
        setScanMessage(statuses[idx]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 250);

    try {
      const response = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: searchQuery })
      });

      if (response.ok) {
        const data = await response.json();
        clearInterval(interval);
        setScanResult(data);
      }
    } catch (err) {
      console.error('Scan network failed:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleLogScanMeal = async () => {
    if (!scanResult) return;
    await handleAddMeal({
      title: scanResult.title,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fats: scanResult.fats,
      mealType: scanSlot,
      aiAnalysis: true
    });
    setSearchQuery('');
    setScanResult(null);
    alert(`✅ "${scanResult.title}" logged for ${scanSlot} successfully!`);
  };

  // Filter collections and ingredients
  const filteredCollections = activeCategory === 'all'
    ? collections
    : collections.filter(c => c.category === activeCategory);

  const filteredIngredients = activeCategory === 'all'
    ? singleIngredients
    : singleIngredients.filter(i => i.category === activeCategory);

  return (
    <div>
      {/* Search Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Ingredients Library</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Explore our curated nutritional database. Powered by AI to help you build the perfect meal plan.
          </p>
        </div>

        {/* Global search */}
        <form onSubmit={handleTriggerAIScan} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search or Describe a meal to Scan with AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '12px' }}
            id="ingredients-search-bar"
          />
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '0.85rem' }}
            id="btn-scan-submit"
          >
            🔍 Scan
          </button>
        </form>
      </div>

      {/* CATEGORY SELECTOR TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '6px' }} id="pills-categories-scroller">
        {[
          { id: 'all', label: 'All Ingredients' },
          { id: 'proteins', label: 'Proteins' },
          { id: 'vegetables', label: 'Vegetables' },
          { id: 'grains', label: 'Grains & Seeds' },
          { id: 'superfoods', label: 'Superfoods' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`category-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            id={`btn-cat-filter-${cat.id}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        
        {/* COLLECTIONS VIEW GRID (Left 8 columns) */}
        <div style={{
          gridColumn: scanning || scanResult ? 'span 7' : 'span 8',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }} id="ingredients-collections-canvas">
          {filteredCollections.map(col => (
            <article key={col.id} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '140px' }}>
                <img src={col.image} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '6px' }}>{col.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '14px', fontWeight: 500 }}>
                    {col.desc}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {col.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className={`badge ${
                          tag.type === 'green' ? 'badge-green' : tag.type === 'amber' ? 'badge-amber' : 'badge-blue'
                        }`}
                        style={{ fontSize: '0.6rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-green)', fontWeight: 800, cursor: 'pointer' }}>
                    {col.linkText} →
                  </span>
                </div>
              </div>
            </article>
          ))}

          {filteredCollections.length === 0 && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No collections found in this category.
            </div>
          )}
        </div>

        {/* SCAN OVERLAY OR SPECIFIC RAW INGREDIENTS LIST (Right 4 columns) */}
        <div style={{ gridColumn: scanning || scanResult ? 'span 5' : 'span 4' }}>
          
          {/* Active AI Scanning laser matrix */}
          {scanning && (
            <div className="glass-panel scan-container" style={{ padding: '24px', minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
              <div className="scan-laser"></div>
              <div className="scan-grid"></div>
              <span style={{ fontSize: '2.5rem', animation: 'typing-bounce 1.5s infinite' }}>🧠</span>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginTop: '12px' }}>Analyzing Ingredients</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--primary-green)', fontWeight: 600, marginTop: '4px' }}>{scanMessage}</p>
            </div>
          )}

          {/* AI Scan result details card */}
          {!scanning && scanResult && (
            <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.62rem', fontWeight: 800, marginBottom: '10px' }}>AI ANALYSIS RESULT</span>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '10px' }}>{scanResult.title}</h3>
                
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid rgba(0,0,0,0.03)', padding: '14px', borderRadius: '12px', textAlign: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>ESTIMATED CALORIES</span>
                  <strong style={{ fontSize: '1.8rem', display: 'block', color: 'var(--accent-rose)', fontWeight: 800 }}>{scanResult.calories} kcal</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ background: 'var(--primary-green-light)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Protein</span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--primary-green)' }}>{scanResult.protein}g</strong>
                  </div>
                  <div style={{ background: 'var(--secondary-blue-light)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Carbs</span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--secondary-blue)' }}>{scanResult.carbs}g</strong>
                  </div>
                  <div style={{ background: 'var(--accent-amber-light)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Fats</span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--accent-amber)' }}>{scanResult.fats}g</strong>
                  </div>
                </div>

                <div style={{ background: 'var(--primary-green-light)', borderLeft: '3px solid var(--primary-green)', padding: '10px 12px', borderRadius: '0 8px 8px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '14px' }}>
                  <strong>Coach Insight:</strong> {scanResult.tips}
                </div>

                {/* Slot Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Select Meal Slot</label>
                  <select 
                    value={scanSlot} 
                    onChange={(e) => setScanSlot(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                    id="select-scan-meal-type"
                  >
                    <option value="breakfast">🍳 Breakfast</option>
                    <option value="lunch">🥗 Lunch</option>
                    <option value="dinner">🐟 Dinner</option>
                    <option value="snack">🍎 Snack</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleLogScanMeal} 
                  className="btn-primary hover-glow" 
                  style={{ flex: 1.5, padding: '10px', fontSize: '0.85rem', borderRadius: '10px' }}
                  id="btn-log-scan-ingredients"
                >
                  Log Ingredient
                </button>
                <button 
                  onClick={() => setScanResult(null)} 
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem', borderRadius: '10px' }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Standard Right-Column Ingredients list */}
          {!scanning && !scanResult && (
            <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Common Ingredients
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredIngredients.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(0,0,0,0.01)',
                      border: '1px solid rgba(0,0,0,0.03)',
                      padding: '10px 12px',
                      borderRadius: '12px'
                    }}
                  >
                    <img src={item.img} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.name}</h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                        <span className={`badge ${
                          item.tag === 'PROTEIN' ? 'badge-green' : item.tag === 'HEALTHY FAT' ? 'badge-amber' : 'badge-blue'
                        }`} style={{ fontSize: '0.58rem', padding: '1px 6px' }}>
                          {item.tag}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.cals}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredIngredients.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No matching ingredients list.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
      
      {/* Hide scroller style */}
      <style>{`
        #pills-categories-scroller::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          #ingredients-collections-canvas { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
