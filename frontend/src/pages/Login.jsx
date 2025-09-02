import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import lanriLogo from '../assets/lanri.png';
import widyabaktiLogo from '../assets/widyabakti.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple form validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/lp');
      } else {
        setError(result.error || 'Failed to login');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--light-color)' 
    }}>
      <div className="card" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: 'white',
        margin: '0 auto'
      }}>
        {/* Logo Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <img 
            src={lanriLogo} 
            alt="LANRI Logo" 
            style={{ 
              height: '60px', 
              width: 'auto',
              borderRadius: '6px',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
            }} 
          />
          <img 
            src={widyabaktiLogo} 
            alt="Widya Bakti Logo" 
            style={{ 
              height: '60px', 
              width: 'auto',
              borderRadius: '6px',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
            }} 
          />
        </div>
        
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: 'var(--primary-color)'
        }}>
          SI-BAKTI
        </h2>
        <h4 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: 'var(--accent-color)'
        }}>
          Login to Access System
        </h4>
        
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#842029', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-control">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
