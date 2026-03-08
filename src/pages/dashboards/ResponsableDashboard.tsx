import React from 'react';
import { Users, GraduationCap, TrendingUp, BarChart2, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';

function ResponsableOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Classes Supervisées', value: '6', icon: Users, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Enseignants', value: '18', icon: GraduationCap, color: 'bg-purple-500', textColor: 'text-purple-500' },
    { label: 'Moyenne Niveau', value: '13.8/20', icon: TrendingUp, color: 'bg-green-500', textColor: 'text-green-500' },
  ];

  const classPerformance = [
    { id: 1, name: '6ème A', average: '14.2', students: 28, teacher: 'M. Dupont' },
    { id: 2, name: '6ème B', average: '13.5', students: 30, teacher: 'Mme. Martin' },
    { id: 3, name: '6ème C', average: '13.8', students: 29, teacher: 'M. Leroy' },
  ];

  const upcomingCouncils = [
    { id: 1, class: '6ème A', date: '2025-03-15', time: '17:00' },
    { id: 2, class: '6ème B', date: '2025-03-16', time: '17:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Supervision pédagogique du niveau.</p>
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
          
          {/* Class Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 size={20} className="text-brand-blue" />
                Performance par Classe
              </h2>
              <Link to="classes" className="text-sm text-brand-blue hover:underline">Détails</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {classPerformance.map((cls) => (
                <div key={cls.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{cls.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cls.students} élèves • PP: {cls.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">{cls.average}/20</p>
                    <p className="text-xs text-green-500">Moyenne</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Councils */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-orange-500" />
                Conseils de Classe
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {upcomingCouncils.map((council) => (
                <div key={council.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Conseil {council.class}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(council.date).toLocaleDateString('fr-FR')} à {council.time}</p>
                    </div>
                  </div>
                  <Link to="conseils" className="text-sm text-brand-blue hover:underline">Préparer</Link>
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
              <Link to="enseignants" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  <span className="font-medium">Voir les enseignants</span>
                </div>
              </Link>
              
              <Link to="statistiques" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <BarChart2 size={20} />
                  <span className="font-medium">Analyser résultats</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Teacher Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search size={20} className="text-blue-500" />
                Recherche Enseignant
              </h2>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Nom ou matière..." 
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

function ResponsableClasses() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classes Supervisées</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Liste des classes et performances...</p>
      </div>
    </div>
  );
}

function ResponsableEnseignants() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enseignants</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Liste des enseignants du niveau...</p>
      </div>
    </div>
  );
}

function ResponsableConseils() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Conseils de Classe</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Planification et rapports des conseils...</p>
      </div>
    </div>
  );
}

function ResponsableStatistiques() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Statistiques</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Analyses détaillées des résultats...</p>
      </div>
    </div>
  );
}

export default function ResponsableDashboard() {
  return (
    <Routes>
      <Route index element={<ResponsableOverview />} />
      <Route path="classes" element={<ResponsableClasses />} />
      <Route path="enseignants" element={<ResponsableEnseignants />} />
      <Route path="conseils" element={<ResponsableConseils />} />
      <Route path="statistiques" element={<ResponsableStatistiques />} />
    </Routes>
  );
}
