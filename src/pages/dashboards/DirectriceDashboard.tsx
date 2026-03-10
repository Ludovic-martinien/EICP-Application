import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, DollarSign, TrendingUp, Settings, FileText, PieChart, BarChart2, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import DirectriceFinances from './directrice/DirectriceFinances';
import DirectriceUtilisateurs from './directrice/DirectriceUtilisateurs';
import DirectricePedagogie from './directrice/DirectricePedagogie';
import DirectriceParametres from './directrice/DirectriceParametres';
import DirectriceAnnonces from './directrice/DirectriceAnnonces';

function DirectriceOverview() {
  const { profile } = useAuth();
  const [totalEleves, setTotalEleves] = useState(0);
  const [totalEnseignants, setTotalEnseignants] = useState(0);
  const [revenus, setRevenus] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch Eleves
      const { count: elevesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'eleve');
      setTotalEleves(elevesCount || 0);

      // Fetch Enseignants
      const { count: enseignantsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .like('role', 'enseignant_%');
      setTotalEnseignants(enseignantsCount || 0);

      // Fetch Paiements (Revenus)
      const { data: paiements } = await supabase
        .from('paiements')
        .select('montant')
        .eq('statut', 'paye');
      
      const totalRevenus = paiements?.reduce((sum, p) => sum + Number(p.montant), 0) || 0;
      setRevenus(totalRevenus);

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const stats = [
    { label: 'Total Élèves', value: totalEleves.toString(), icon: Users, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Enseignants', value: totalEnseignants.toString(), icon: GraduationCap, color: 'bg-purple-500', textColor: 'text-purple-500' },
    { label: 'Revenus', value: `${revenus.toLocaleString('fr-FR')} €`, icon: DollarSign, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Réussite Globale', value: '88%', icon: TrendingUp, color: 'bg-orange-500', textColor: 'text-orange-500' },
  ];

  const financialOverview = [
    { month: 'Janvier', revenue: 42000, expenses: 35000 },
    { month: 'Février', revenue: 45000, expenses: 38000 },
    { month: 'Mars', revenue: 48000, expenses: 36000 },
  ];

  const enrollmentStats = [
    { level: 'Maternelle', count: 80, capacity: 100 },
    { level: 'Primaire', count: 200, capacity: 250 },
    { level: 'Collège', count: 170, capacity: 200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, Madame la Directrice !</h1>
          <p className="text-slate-500 dark:text-slate-400">Vue d'ensemble de l'établissement.</p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 hidden sm:block">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.color} bg-opacity-10 ${stat.textColor}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Financial Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 size={20} className="text-brand-blue" />
                Aperçu Financier (Trimestre 1)
              </h2>
              <Link to="finances" className="text-sm text-brand-blue hover:underline">Rapport complet</Link>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end justify-between gap-4">
                {financialOverview.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                      <div 
                        className="w-8 bg-green-500 rounded-t-lg transition-all duration-500" 
                        style={{ height: `${(item.revenue / 50000) * 100}%` }}
                        title={`Revenus: ${item.revenue}€`}
                      ></div>
                      <div 
                        className="w-8 bg-red-400 rounded-t-lg transition-all duration-500" 
                        style={{ height: `${(item.expenses / 50000) * 100}%` }}
                        title={`Dépenses: ${item.expenses}€`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Revenus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Dépenses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart size={20} className="text-purple-500" />
                Effectifs par Niveau
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {enrollmentStats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">{stat.level}</span>
                    <span className="text-slate-500 dark:text-slate-400">{stat.count} / {stat.capacity} ({Math.round((stat.count / stat.capacity) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        (stat.count / stat.capacity) > 0.9 ? 'bg-red-500' : 'bg-brand-blue'
                      }`}
                      style={{ width: `${(stat.count / stat.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Administration</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link to="utilisateurs" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  <span className="font-medium">Gérer utilisateurs</span>
                </div>
                <Settings size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link to="finances" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} />
                  <span className="font-medium">Superviser finances</span>
                </div>
                <Settings size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link to="pedagogie" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <GraduationCap size={20} />
                  <span className="font-medium">Superviser pédagogie</span>
                </div>
                <Settings size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings size={20} className="text-slate-500" />
                État du Système
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Serveur</span>
                <span className="flex items-center gap-2 text-xs font-medium text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Opérationnel
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Base de données</span>
                <span className="flex items-center gap-2 text-xs font-medium text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Connecté
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Dernière sauvegarde</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Aujourd'hui, 03:00</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



export default function DirectriceDashboard() {
  return (
    <Routes>
      <Route index element={<DirectriceOverview />} />
      <Route path="finances" element={<DirectriceFinances />} />
      <Route path="utilisateurs" element={<DirectriceUtilisateurs />} />
      <Route path="pedagogie" element={<DirectricePedagogie />} />
      <Route path="annonces" element={<DirectriceAnnonces />} />
      <Route path="parametres" element={<DirectriceParametres />} />
    </Routes>
  );
}
