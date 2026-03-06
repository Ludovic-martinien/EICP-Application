import React, { useState, useEffect, FormEvent } from 'react';
import { Lock, RefreshCw, Trash2, Search, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface Inquiry {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  niveau: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchInquiries();
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAuthenticated) {
      interval = setInterval(fetchInquiries, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const filteredInquiries = inquiries.filter(inquiry => 
    inquiry.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-red/10 dark:bg-red-900/30 text-brand-red dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Accès Administrateur</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Veuillez vous identifier pour continuer</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                placeholder="Mot de passe"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg hover:shadow-brand-red/30"
            >
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white text-sm">A</span>
            Administration
          </h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Demandes d'inscription</h2>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-cyan outline-none"
              />
            </div>
            <button 
              onClick={fetchInquiries} 
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:text-brand-red dark:hover:text-red-400 transition-colors"
              title="Actualiser"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">Élève</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">Niveau</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">Contact</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">Message</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      Aucune demande trouvée
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(inquiry.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{inquiry.nom} {inquiry.prenom}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-brand-blue/10 dark:bg-blue-900/30 text-brand-blue dark:text-blue-400 border border-brand-blue/20 dark:border-blue-800">
                          {inquiry.niveau}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col">
                          <span>{inquiry.email}</span>
                          <span className="text-slate-400 dark:text-slate-500 text-xs">{inquiry.telephone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {inquiry.message || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-brand-red transition-colors p-1">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
