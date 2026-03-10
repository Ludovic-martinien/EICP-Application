import React from 'react';
import { TrendingUp, Award, BookOpen, PieChart, FileText, Search, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';
import PedagogiqueProgrammes from './pedagogique/PedagogiqueProgrammes';
import PedagogiqueStatistiques from './pedagogique/PedagogiqueStatistiques';
import PedagogiqueRapports from './pedagogique/PedagogiqueRapports';
import PedagogiqueEnseignants from './pedagogique/PedagogiqueEnseignants';

function PedagogiqueOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Performance Globale', value: '78%', icon: TrendingUp, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Réussite Examens', value: '92%', icon: Award, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { label: 'Programmes Actifs', value: '14', icon: BookOpen, color: 'bg-blue-500', textColor: 'text-blue-500' },
  ];

  const subjectPerformance = [
    { id: 1, subject: 'Mathématiques', average: '12.5', trend: 'up' },
    { id: 2, subject: 'Français', average: '13.8', trend: 'stable' },
    { id: 3, subject: 'Histoire-Géo', average: '14.2', trend: 'up' },
    { id: 4, subject: 'Physique-Chimie', average: '11.9', trend: 'down' },
  ];

  const programProgress = [
    { id: 1, level: '3ème', subject: 'Mathématiques', progress: 65 },
    { id: 2, level: '4ème', subject: 'Français', progress: 72 },
    { id: 3, level: '5ème', subject: 'Histoire', progress: 58 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Pilotage pédagogique et académique.</p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 hidden sm:block">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          {/* Subject Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart size={20} className="text-brand-blue" />
                Moyennes par Matière
              </h2>
              <Link to="statistiques" className="text-sm text-brand-blue hover:underline">Détails complets</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {subjectPerformance.map((subj) => (
                <div key={subj.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-medium text-slate-900 dark:text-white">{subj.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{subj.average}</span>
                    <span className={`text-xs ${
                      subj.trend === 'up' ? 'text-green-500' : 
                      subj.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {subj.trend === 'up' ? '↑' : subj.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-purple-500" />
                Avancement des Programmes
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {programProgress.map((prog) => (
                <div key={prog.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">{prog.subject} ({prog.level})</span>
                    <span className="text-slate-500 dark:text-slate-400">{prog.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                    <div 
                      className="bg-brand-blue h-2.5 rounded-full" 
                      style={{ width: `${prog.progress}%` }}
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actions Rapides</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link to="statistiques" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <BarChart2 size={20} />
                  <span className="font-medium">Analyser résultats</span>
                </div>
              </Link>
              
              <Link to="programmes" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} />
                  <span className="font-medium">Modifier programmes</span>
                </div>
              </Link>

              <Link to="rapports" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <span className="font-medium">Générer rapport</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search size={20} className="text-blue-500" />
                Recherche
              </h2>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Matière, classe ou programme..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



export default function PedagogiqueDashboard() {
  return (
    <Routes>
      <Route index element={<PedagogiqueOverview />} />
      <Route path="programmes" element={<PedagogiqueProgrammes />} />
      <Route path="statistiques" element={<PedagogiqueStatistiques />} />
      <Route path="rapports" element={<PedagogiqueRapports />} />
      <Route path="enseignants" element={<PedagogiqueEnseignants />} />
    </Routes>
  );
}
