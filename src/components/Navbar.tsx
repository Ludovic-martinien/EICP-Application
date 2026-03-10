import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, DollarSign, Star, UserPlus, Phone, Sun, Moon, LayoutDashboard, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Programme', path: '/programme', icon: BookOpen },
    { name: 'Tarifs', path: '/tarifs', icon: DollarSign },
    { name: 'Avantages', path: '/avantages', icon: Star },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const mobileLinks = [
    ...links,
    ...(!user ? [
      { name: 'Connexion', path: '/login', icon: LogIn },
      { name: 'Inscription', path: '/register', icon: UserPlus },
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="EICP ShopUniversities" 
                className="h-14 w-auto object-contain bg-white rounded-lg p-1"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x100?text=EICP+Logo";
                }}
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isActive(link.path)
                      ? "bg-brand-blue/10 dark:bg-brand-blue/30 text-brand-blue dark:text-blue-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-blue dark:hover:text-blue-300"
                  )}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <Link
                to={`/dashboard/${profile?.role.split('_')[0] || 'eleve'}`}
                className="ml-4 flex items-center gap-2 bg-brand-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <LayoutDashboard size={18} />
                Mon Espace
              </Link>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-blue-300 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  <LogIn size={18} />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-red to-red-600 hover:from-red-700 hover:to-brand-red text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <UserPlus size={18} />
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center lg:hidden gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {mobileLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive(link.path)
                        ? "bg-brand-blue/10 dark:bg-brand-blue/30 text-brand-blue dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
                {user && (
                  <Link
                    to={`/dashboard/${profile?.role.split('_')[0] || 'eleve'}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold bg-brand-blue text-white hover:bg-blue-700 mt-2 shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={20} />
                    Mon Espace
                  </Link>
                )}
              </div>

              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 mt-2"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={16} />
                Administration (Legacy)
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
