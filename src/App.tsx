import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programme from './pages/Programme';
import Tarifs from './pages/Tarifs';
import Avantages from './pages/Avantages';
import Inscription from './pages/Inscription';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import EleveDashboard from './pages/dashboards/EleveDashboard';
import EnseignantDashboard from './pages/dashboards/EnseignantDashboard';
import SurveillantDashboard from './pages/dashboards/SurveillantDashboard';
import SecretaireDashboard from './pages/dashboards/SecretaireDashboard';
import ComptableDashboard from './pages/dashboards/ComptableDashboard';
import ResponsableDashboard from './pages/dashboards/ResponsableDashboard';
import PedagogiqueDashboard from './pages/dashboards/PedagogiqueDashboard';
import DirectriceDashboard from './pages/dashboards/DirectriceDashboard';
import { getDashboardPath } from './utils/roleUtils';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="flex flex-col min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors duration-300">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/programme" element={<PublicLayout><Programme /></PublicLayout>} />
            <Route path="/tarifs" element={<PublicLayout><Tarifs /></PublicLayout>} />
            <Route path="/avantages" element={<PublicLayout><Avantages /></PublicLayout>} />
            <Route path="/inscription" element={<PublicLayout><Inscription /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                
                <Route path="eleve/*" element={<EleveDashboard />} />
                
                <Route path="enseignant/*" element={<EnseignantDashboard />} />
                
                <Route path="surveillant/*" element={<SurveillantDashboard />} />
                
                <Route path="secretaire/*" element={<SecretaireDashboard />} />
                
                <Route path="comptable/*" element={<ComptableDashboard />} />
                
                <Route path="responsable/*" element={<ResponsableDashboard />} />
                
                <Route path="pedagogique/*" element={<PedagogiqueDashboard />} />
                
                <Route path="directrice/*" element={<DirectriceDashboard />} />
              </Route>
            </Route>

          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

function DashboardIndex() {
  const { profile } = useAuth();
  if (!profile) return null;
  return <Navigate to={getDashboardPath(profile.role)} replace />;
}

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors duration-300">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);
