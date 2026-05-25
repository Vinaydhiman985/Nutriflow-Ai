import React, { useContext } from 'react';
import { CalorieContext } from '../App';

export default function Navbar() {
  const { activeTab, setActiveTab } = useContext(CalorieContext);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      id: 'planner',
      label: 'AI Planner',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M9 10h6" />
          <path d="M9 14h4" />
        </svg>
      )
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
      )
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      )
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="glass-panel" style={{
        width: '250px',
        padding: '30px 16px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 40px)',
        position: 'sticky',
        top: '20px',
        margin: '20px 0 20px 20px',
        zIndex: '100',
        borderRadius: '24px',
        background: '#ffffff'
      }} id="desktop-sidebar-navbar">
        
        {/* Brand Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'var(--primary-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            🍏
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              NutriFlow AI
            </h1>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Your Digital Coach
            </span>
          </div>
        </div>

        {/* Sidebar Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`sidebar-link-${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: isActive ? 'var(--primary-green-light)' : 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
                  textAlign: 'left',
                  fontSize: '0.94rem',
                  fontWeight: isActive ? 700 : 600,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                {/* Active indicator dot left line */}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    width: '3.5px',
                    height: '18px',
                    borderRadius: '0 4px 4px 0',
                    background: 'var(--primary-green)',
                    boxShadow: '0 0 6px var(--primary-green)'
                  }}></span>
                )}
                
                <span style={{
                  color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {item.icon}
                </span>
                
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Big green Log Food CTA trigger */}
        <button 
          onClick={() => setActiveTab('schedule')}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '0.9rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
          id="btn-sidebar-log-food"
        >
          <span>➕</span> Log Food
        </button>

        {/* Connection status footer */}
        <div style={{
          padding: '14px',
          borderRadius: '16px',
          background: 'var(--bg-canvas)',
          border: '1px solid rgba(0,0,0,0.04)',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AI Coach Sync</h4>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--primary-green)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '3px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--primary-green)',
              boxShadow: '0 0 6px var(--primary-green)',
              animation: 'typing-bounce 1.5s infinite'
            }}></span>
            Live Bio-Intelligence
          </span>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="glass-panel" style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0',
        borderRadius: '20px 20px 0 0',
        background: '#ffffff',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        zIndex: '1000',
        boxShadow: '0 -8px 24px rgba(15,23,42,0.04)'
      }} id="mobile-bottom-navbar">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 600,
                padding: '4px 10px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Responsive stylesheet bindings */}
      <style>{`
        @media (max-width: 1024px) {
          #desktop-sidebar-navbar {
            display: none !important;
          }
          #mobile-bottom-navbar {
            display: flex !important;
          }
          .content-canvas {
            margin-bottom: 76px !important;
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </>
  );
}
