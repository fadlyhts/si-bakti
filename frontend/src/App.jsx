import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Pages
import Login from './pages/Login'
import LP from './pages/LP'
import Sprindik from './pages/Sprindik'
import BeritaAcara from './pages/BeritaAcara'
import Asset from './pages/Asset'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Context
import { AuthProvider } from './contexts/AuthContext'

function App() {
  // Add global CSS variables for the color theme
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', '#4CAF50') // Green
    document.documentElement.style.setProperty('--secondary-color', '#FFFFFF') // White
    document.documentElement.style.setProperty('--accent-color', '#2E7D32') // Dark Green
    document.documentElement.style.setProperty('--light-color', '#E8F5E9') // Light Green
    document.documentElement.style.setProperty('--text-dark', '#212121') // Dark text
    document.documentElement.style.setProperty('--text-light', '#FFFFFF') // Light text
  }, [])

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/lp" element={
            <ProtectedRoute>
              <LP />
            </ProtectedRoute>
          } />
          
          <Route path="/sprindik/:lpId" element={
            <ProtectedRoute>
              <Sprindik />
            </ProtectedRoute>
          } />
          
          <Route path="/berita-acara/:sprindikId" element={
            <ProtectedRoute>
              <BeritaAcara />
            </ProtectedRoute>
          } />
          
          <Route path="/asset/:baId" element={
            <ProtectedRoute>
              <Asset />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
