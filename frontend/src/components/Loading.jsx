import React from 'react';
import { PuffLoader } from 'react-spinners';
import lanriLogo from '../assets/lanri.png';
import widyabaktiLogo from '../assets/widyabakti.png';

const Loading = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, var(--light-color) 0%, #f0f8f0 100%)',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Logo Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem'
        }}>
          <img 
            src={lanriLogo} 
            alt="LANRI Logo" 
            style={{ 
              height: '50px', 
              width: 'auto',
              borderRadius: '6px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }} 
          />
          <img 
            src={widyabaktiLogo} 
            alt="Widya Bakti Logo" 
            style={{ 
              height: '50px', 
              width: 'auto',
              borderRadius: '6px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }} 
          />
        </div>
        
        {/* App Title */}
        <div style={{
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0',
            color: 'var(--primary-color)',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            SI-BAKTI
          </h2>
          <p style={{
            margin: 0,
            color: 'var(--accent-color)',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Sistem Informasi Barang Bukti
          </p>
        </div>
        
        {/* React Spinner */}
        <PuffLoader
          color="var(--primary-color)"
          loading={true}
          size={60}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        
        {/* Loading Text */}
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: '500',
            color: 'var(--primary-color)',
            marginBottom: '0.5rem'
          }}>
            Loading...
          </div>
          
          <div style={{
            fontSize: '0.85rem',
            color: '#666',
            opacity: 0.8
          }}>
            Please wait while we prepare your workspace
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
