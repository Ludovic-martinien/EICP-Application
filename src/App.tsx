import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programme from './pages/Programme';
import Tarifs from './pages/Tarifs';
import Avantages from './pages/Avantages';
import Inscription from './pages/Inscription';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/programme" element={<Programme />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/avantages" element={<Avantages />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
