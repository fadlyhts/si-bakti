import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import lanriLogo from '../assets/lanri.png';
import widyabaktiLogo from '../assets/widyabakti.png';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setShowUserDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        {/* Brand */}
        <Link to="/lp" className="navbar-brand">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            {/* Logo Images */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <img 
                src={lanriLogo} 
                alt="LANRI Logo" 
                style={{ 
                  height: '25px', 
                  width: 'auto',
                  borderRadius: '3px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <img 
                src={widyabaktiLogo} 
                alt="Widya Bakti Logo" 
                style={{ 
                  height: '25px', 
                  width: 'auto',
                  borderRadius: '3px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }} 
              />
            </div>
            {/* Brand Text */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '1rem',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}>SI-BAKTI</span>
              <span style={{ 
                fontSize: '0.65rem', 
                opacity: 0.8,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}>
                Sistem Informasi Barang Bukti
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="navbar-menu">
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* LP Menu */}
            <li className="navbar-item">
              <Link 
                to="/lp" 
                style={{ 
                  color: 'var(--text-light)', 
                  textDecoration: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.target.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                  e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.2)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📋 LP
              </Link>
            </li>

            {/* User Profile Dropdown */}
            <li className="navbar-item">
              <div className="dropdown" style={{ position: 'relative' }}>
                <button 
                  className="dropdown-toggle" 
                  onClick={toggleUserDropdown}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--text-light)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.3s',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span>👤</span>
                  <span>{user?.username || 'User'}</span>
                  {isAdmin && <span style={{ 
                    fontSize: '0.6rem', 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '0.1rem 0.25rem',
                    borderRadius: '2px'
                  }}>ADMIN</span>}
                  <span style={{ transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', fontSize: '0.7rem' }}>▼</span>
                </button>
                
                {showUserDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99
                      }}
                      onClick={closeDropdown}
                    ></div>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className="dropdown-menu" 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        minWidth: '200px',
                        backgroundColor: 'var(--secondary-color)',
                        boxShadow: `
                          0 10px 25px rgba(0, 0, 0, 0.15),
                          0 5px 10px rgba(0, 0, 0, 0.1),
                          0 0 0 1px rgba(0, 0, 0, 0.05)
                        `,
                        borderRadius: '8px',
                        padding: '0.5rem 0',
                        zIndex: 100,
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        marginTop: '0.5rem'
                      }}
                    >
                      {/* User Info */}
                      <div style={{ 
                        padding: '0.75rem 1rem', 
                        borderBottom: '1px solid #eee',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>
                          {user?.username}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {isAdmin ? 'Administrator' : 'User'} • Role ID: {user?.role}
                        </div>
                      </div>

                      {/* Admin Links */}
                      {isAdmin && (
                        <>
                          <div style={{ 
                            padding: '0.5rem 1rem', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold', 
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Admin Functions
                          </div>
                          <Link 
                            to="/lp" 
                            className="dropdown-item"
                            onClick={closeDropdown}
                            style={{
                              display: 'block',
                              padding: '0.5rem 1rem',
                              color: 'var(--text-dark)',
                              textDecoration: 'none',
                              transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--light-color)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            📋 Manage LP
                          </Link>
                          <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                        </>
                      )}

                      {/* Logout Button */}
                      <button 
                        onClick={handleLogout} 
                        className="dropdown-item"
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.5rem 1rem',
                          color: '#dc3545',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8d7da'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
