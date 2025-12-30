import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAccess } from '@/context/AccessContext';
import logo from '@/assets/logo.png';
import styles from './Header.module.css';

const Header = () => {
  const { hasAccess, logout, user } = useAccess(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* ΑΡΙΣΤΕΡΑ: Το Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Electronics R&R" className={styles.logoImage} />
          <span>
            Electronics <strong>R&amp;R</strong>
          </span>
        </Link>

        {/* ΔΕΞΙΑ: Το Μενού */}
        <nav className={styles.nav}>
          {hasAccess && 
           location.pathname !== "/" && 
           location.pathname !== "/forgot-password" ? (
            <>
              <Link to="/dashboard" className={styles.link}>
                ☷ Dashboard
              </Link>
              <Link to="/requests" className={styles.link}>
                🎟 Requests
              </Link>
              <Link to="/create-ticket" className={styles.link}>
                + New Request
              </Link>

              {/* 1. SIGN OUT ΠΡΙΝ ΤΟ ΠΡΟΦΙΛ */}
              <button onClick={handleLogout} className={styles.authButton}>
                Sign Out
              </button>

              {/* 2. PROFILE DROPDOWN ΣΤΟ ΤΕΛΟΣ ΔΕΞΙΑ */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className={styles.link} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  👤
                </button>

                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '200px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    textAlign: 'left',
                    marginTop: '10px'
                  }}>
                    <div style={{ color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                       {user?.fullName || 'User Profile'}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: '10px', wordBreak: 'break-all' }}>
                       {user?.email || 'user@example.com'}
                    </div>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '8px 0' }} />
                    
                    <button 
                      onClick={() => { setIsDropdownOpen(false); navigate('/dashboard'); }}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        background: 'none', 
                        border: 'none', 
                        color: '#2563eb', 
                        cursor: 'pointer',
                        padding: '4px 0',
                        fontSize: '13px'
                      }}
                    >
                      ⚙️ Account Settings
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;