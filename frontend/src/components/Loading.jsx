import React from 'react';
import { PuffLoader } from 'react-spinners';
import faviconLogo from '../assets/favicon.jpg';
import lanriLogo from '../assets/lanri.png';

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
        gap: '1.5rem',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* LANRI Logo - Small at top right corner like login form */}
        <img
          src={lanriLogo}
          alt="LANRI Logo"
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            height: '35px',
            width: 'auto',
            borderRadius: '4px',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
            zIndex: 10
          }}
        />
        {/* Logo Section - Centered like login page */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1.5rem',
          marginTop: '1rem'
        }}>
          <img
            src={faviconLogo}
            alt="SI-BAKTI Logo"
            style={{
              height: '70px',
              width: 'auto',
              borderRadius: '8px',
              filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2))'
            }}
          />
        </div>
        
        {/* App Title - Matching login page */}
        <h2 style={{
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: 'var(--primary-color)'
        }}>
          SI-BAKTI
        </h2>
        <h4 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'var(--accent-color)'
        }}>
          SISTEM INFORMASI BARANG BUKTI PENYIDIKAN TINDAK PIDANA KORUPSI
        </h4>
        
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
