import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Navigation/Sidebar';
import Login from './pages/Login/Login';
import SocialFeed from './pages/SocialFeed/SocialFeed';
import EditImage from './pages/EditImage/EditImage';
import CreateImage from './pages/CreateImage/CreateImage';
import CreateVideo from './pages/CreateVideo/CreateVideo';
import Assets from './pages/Assets/Assets';
import Credits from './pages/Credits';
import Profile from './pages/Profile/Profile';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Layout Component
const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar onToggleCollapse={setIsSidebarCollapsed} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {



  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Navigate to="/social-feed" replace />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/social-feed" element={
              <ProtectedRoute>
                <AppLayout>
                  <SocialFeed />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/edit-image" element={
              <ProtectedRoute>
                <AppLayout>
                  <EditImage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/create-image" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateImage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/create-video" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateVideo />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/assets" element={
              <ProtectedRoute>
                <AppLayout>
                  <Assets />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/credits" element={
              <ProtectedRoute>
                <AppLayout>
                  <Credits />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;